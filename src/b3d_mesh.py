"""Realistic 3D brain mesh (fsaverage5 cortex + cerebellum/brainstem from MNI152) and a
numpy/skia painter's-algorithm renderer with per-vertex shading."""
import os, math
import numpy as np
import skia

CACHE = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'assets', 'brain_mesh.npz')


def _build():
    import nibabel as nib, nilearn
    from skimage import measure
    from scipy.ndimage import gaussian_filter, binary_opening
    d = os.path.join(os.path.dirname(nilearn.__file__), 'datasets', 'data')
    V, F, SUL, PART = [], [], [], []
    off = 0
    for hemi in ('left', 'right'):
        c, t = nib.load(os.path.join(d, 'fsaverage5', f'pial_{hemi}.gii.gz')).agg_data()
        s = nib.load(os.path.join(d, 'fsaverage5', f'sulc_{hemi}.gii.gz')).agg_data()
        V.append(c.astype(np.float32))
        F.append(t.astype(np.int32) + off)
        SUL.append(s.astype(np.float32))
        PART.append(np.zeros(len(c), np.int8))
        off += len(c)
    # cerebellum + brainstem from the MNI152 tissue maps
    gm = nib.load(os.path.join(d, 'mni_icbm152_gm_tal_nlin_sym_09a_converted.nii.gz'))
    wm = nib.load(os.path.join(d, 'mni_icbm152_wm_tal_nlin_sym_09a_converted.nii.gz'))
    vol = (gm.get_fdata() + wm.get_fdata()) / 255.0
    aff = gm.affine
    ii, jj, kk = np.meshgrid(np.arange(vol.shape[0]), np.arange(vol.shape[1]), np.arange(vol.shape[2]),
                             indexing='ij')
    X = aff[0, 0] * ii + aff[0, 3]
    Y = aff[1, 1] * jj + aff[1, 3]
    Z = aff[2, 2] * kk + aff[2, 3]
    cereb = (Y < -42) & (Z < -12)
    stem = (np.abs(X) < 13) & (Y > -42) & (Y < -8) & (Z < -14) & (Z > -62)
    m = vol * (cereb | stem)
    m = gaussian_filter(m, .8)
    v, f, n, _ = measure.marching_cubes(m, .45, step_size=2)
    v = v @ np.diag([aff[0, 0], aff[1, 1], aff[2, 2]]) + aff[:3, 3]
    # tiny shift so the cerebellum tucks under the fsaverage occipital lobe
    v = v + np.array([0, 2, 3])
    # pseudo-sulc for the cerebellum: folia stripes
    sul = np.sin(v[:, 2] * 1.1 + v[:, 1] * .35) * .8
    V.append(v.astype(np.float32))
    F.append(f[:, ::-1].astype(np.int32) + off)
    SUL.append(sul.astype(np.float32))
    PART.append(np.ones(len(v), np.int8))
    V = np.concatenate(V)
    F = np.concatenate(F)
    SUL = np.concatenate(SUL)
    PART = np.concatenate(PART)
    np.savez_compressed(CACHE, V=V, F=F, S=SUL, P=PART)


def load():
    if not os.path.exists(CACHE):
        _build()
    z = np.load(CACHE)
    V, F, S, P = z['V'].astype(np.float64), z['F'], z['S'].astype(np.float64), z['P']
    ctr = (V.min(0) + V.max(0)) / 2
    V = V - ctr
    return V, F, S, P, ctr


def vertex_normals(V, F):
    a, b, c = V[F[:, 0]], V[F[:, 1]], V[F[:, 2]]
    fn = np.cross(b - a, c - a)
    vn = np.zeros_like(V)
    for k in range(3):
        np.add.at(vn, F[:, k], fn)
    vn /= np.linalg.norm(vn, axis=1, keepdims=True) + 1e-9
    return vn, fn


def adjacency(F, n):
    e = np.concatenate([F[:, [0, 1]], F[:, [1, 2]], F[:, [2, 0]]])
    nb = [[] for _ in range(n)]
    for a, b in e:
        nb[a].append(b)
        nb[b].append(a)
    return [list(set(x)) for x in nb]


def rot(yaw, pitch):
    """mesh coords (x=left/right, y=post->ant, z=inf->sup) -> view (sx right, sy down, depth toward viewer)"""
    cy, sy = math.cos(yaw), math.sin(yaw)
    cp, sp = math.cos(pitch), math.sin(pitch)
    # yaw about z; at yaw=0 front (+y) points to screen right, right hemisphere (+x) faces viewer
    R1 = np.array([[0, 1, 0], [0, 0, -1], [1, 0, 0]], float)  # x->depth, y->sx, z->-sy
    Rz = np.array([[cy, -sy, 0], [sy, cy, 0], [0, 0, 1]])
    Rp = np.array([[1, 0, 0], [0, cp, -sp], [0, sp, cp]])  # tilt: look slightly from above
    return Rp @ R1 @ Rz


def shade(Vv, Nv, base, emis, light=1.0, rim=.55, spec=.35):
    """Vv,Nv in view space. base: (n,3) albedo 0..1, emis: (n,3) added emission. returns uint8 rgb"""
    L1 = np.array([-.45, -.65, .62])
    L1 /= np.linalg.norm(L1)
    L2 = np.array([.8, .1, .4])
    L2 /= np.linalg.norm(L2)
    Vd = np.array([0, 0, 1.0])
    d1 = np.clip(Nv @ L1, 0, 1)
    d2 = np.clip(Nv @ L2, 0, 1)
    Hh = (L1 + Vd) / np.linalg.norm(L1 + Vd)
    sp = np.clip(Nv @ Hh, 0, 1) ** 28
    ndv = np.clip(Nv @ Vd, 0, 1)
    fr = (1 - ndv) ** 3
    col = base * (.16 + .95 * d1[:, None] * light + .25 * d2[:, None] * np.array([1, .3, .3]))
    col += sp[:, None] * spec * light * np.array([1, .85, .85])
    col += fr[:, None] * rim * np.array([1, .16, .2])
    col += emis
    return np.clip(col * 255, 0, 255)


def draw_mesh(cv, P2, depth, Fvis, cols, alpha=1.0):
    """P2: (n,2) screen pts, depth: (n,), Fvis: faces to draw, cols (n,3) uint8-ish"""
    if len(Fvis) == 0:
        return
    zf = depth[Fvis].mean(1)
    order = np.argsort(zf)  # far (small depth) first
    idx = Fvis[order].ravel().tolist()
    pts = [skia.Point(float(x), float(y)) for x, y in P2]
    a = int(alpha * 255)
    c = cols.astype(np.uint32)
    argb = ((a << 24) | (c[:, 0] << 16) | (c[:, 1] << 8) | c[:, 2]).tolist()
    vt = skia.Vertices(skia.Vertices.kTriangles_VertexMode, pts, None, argb, idx)
    cv.drawVertices(vt, skia.Paint(AntiAlias=True), skia.BlendMode.kDst)
