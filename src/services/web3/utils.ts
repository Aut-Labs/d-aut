/* tslint:disable */

export const pxToRem = (size: number | string) => {
  size = `${size}`.replace('px', '');

  return `${size}px`;

  // return `${px}px`;
  const x = 16;
  const rem = `${(1 / x) * Number(size)}rem`;
  return rem;
};
