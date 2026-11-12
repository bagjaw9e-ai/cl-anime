// dur = panjang sequence (frame, termasuk overlap transisi), b = beat tambahan (frame relatif),
// hit = frame relatif momen SFX (kalau ada). Kata pertama potongan jatuh di frame ~3.
export type SceneProps = {dur: number; b: number[]; hit: number};
