export const FindTextCenter = (
  parentElWidth: number,
  offset = 0,
  metric: 'width' | 'height' = 'width',
  font = 'JosefinSans-Regular, Josefin Sans'
) => {
  const canvas = document.createElement('canvas');
  const middle = parentElWidth / 2;
  return (text: string, fontSize: string) => {
    const context = canvas.getContext('2d');
    context.font = `${fontSize} ${font}`;
    const metrics = context.measureText(text);
    const size = Number(metrics[metric]);
    return middle - size / 2 - offset;
  };
};

const isBrowser = typeof document !== 'undefined';

export const FindTextWidth = (font = 'JosefinSans-Regular, Josefin Sans') => {
  if (!isBrowser) {
    return;
  }
  const canvas = document.createElement('canvas');
  return (text: string, fontSize: string) => {
    const context = canvas.getContext('2d');
    context.font = `${fontSize} ${font}`;
    const metrics = context.measureText(text);
    return metrics.width;
  };
};
