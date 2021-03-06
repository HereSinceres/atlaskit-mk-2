const emojiMap: { [key: string]: string } = {
  'smile.png': 'đ',
  'sad.png': 'âšī¸',
  'tongue.png': 'đ',
  'biggrin.png': 'đ',
  'wink.png': 'đ',
  'thumbs_up.png': 'đ',
  'thumbs_down.png': 'đ',
  'information.png': 'âšī¸',
  'check.png': 'â',
  'error.png': 'â',
  'warning.png': 'â ī¸',
  'add.png': 'â',
  'forbidden.png': 'â',
  'help_16.png': 'â',
  'lightbulb_on.png': 'đĄ',
  'lightbulb.png': 'âī¸',
  'star_yellow.png': 'đ',
  'star_red.png': 'â¤ī¸',
  'star_green.png': 'đ',
  'star_blue.png': 'đ',
  'flag.png': 'đŠ',
  'flag_gray.png': 'đŗ',
};

export function mapImageToEmoji(imageElement: HTMLImageElement) {
  let src = imageElement.src;
  let slashIndex = src.lastIndexOf('/');
  src = src.substr(slashIndex + 1);
  return emojiMap[src] || null;
}
