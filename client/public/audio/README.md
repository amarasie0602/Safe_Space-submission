# Calm Corner audio

The Calm Corner sound mixer (`client/src/components/calm/SoundMixer.jsx`)
expects five looping ambient tracks here, referenced from
`client/src/config/calmCorner.js`:

- `rain.mp3`
- `ocean.mp3`
- `forest.mp3`
- `cafe.mp3`
- `piano.mp3`

None of these files are included — the UI (tiles, volume sliders, master
volume, sleep timer) works fully without them; a missing file just means
that tile silently produces no sound until a real file is added.

## Where to get real files (CC0 / royalty-free, no attribution required)

- **Pixabay Audio** — https://pixabay.com/sound-effects/ and
  https://pixabay.com/music/ — search "rain", "ocean waves", "forest
  ambience", "cafe ambience", "soft piano".
- **Freesound** (filter to CC0) — https://freesound.org/search/?f=license%3A%22Creative+Commons+0%22
- **Mixkit** — https://mixkit.co/free-sound-effects/ and
  https://mixkit.co/free-stock-music/

## Requirements

- Keep each file under 2MB (trim to ~60-90s and let the `loop` attribute
  handle the rest — a seamless loop point matters more than length).
- MP3, 128kbps is plenty for background ambience.
- Rename whatever you download to match the filenames above, or update
  the `src` paths in `client/src/config/calmCorner.js` to match your
  filenames instead.
