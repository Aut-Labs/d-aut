import { ContentConfig, SWIDParams, SWIDOutput } from './Badge.model';
import { FindTextCenter } from './FindCenter';
import { LoadImage } from './ImageLoader';
import { AutBackgroundGoerliSvg, AutBackgroundMumbaiSvg } from './SwBackgroundSvg';

const drawCanvasElements = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, config: ContentConfig) => {
  const { title, timestamp, canvasFont, hash, qrImage, width } = config;

  const drawBackground = async (network: string) => {
    let url = null;
    if (network === 'mumbai') {
      url = AutBackgroundMumbaiSvg({
        title: title.text,
        hash: hash.text,
        width,
        timestamp: timestamp.text,
      });
    } else if (network === 'goerli') {
      url = AutBackgroundGoerliSvg({
        title: title.text,
        hash: hash.text,
        width,
        timestamp: timestamp.text,
      });
    }
    const backgroundImage = await LoadImage(url);
    ctx.drawImage(backgroundImage, 0, 0);
  };

  const drawNameAndTime = async () => {
    const fontFace = new FontFace(canvasFont.name, `url(${canvasFont.url})`, {
      weight: '100',
    });
    await fontFace.load();

    const center = FindTextCenter(canvas.width, 0, 'width', canvasFont.fontFamily);

    // Title styles
    ctx.font = `${title.fontWeight} ${title.fontSize} ${canvasFont.fontFamily}`;
    ctx.strokeStyle = title.color;
    const titleLeft = center(title.text, title.fontSize);
    ctx.fillText(title.text, titleLeft, title.top);

    // Timestamp styles
    ctx.font = `${timestamp.fontWeight} ${timestamp.fontSize} ${canvasFont.fontFamily}`;
    const timestampLeft = center(timestamp.text, timestamp.fontSize);
    ctx.fillText(timestamp.text, timestampLeft, timestamp.top);
  };

  return {
    drawBackground,
    drawNameAndTime,
  };
};

const defaulConfig = (
  config: ContentConfig,
  avatar: string,
  tokenId: string,
  title: string,
  timestamp: string,
  hash: string
): ContentConfig => {
  const WIDTH = config?.width || 440;
  const HEIGHT = config?.height || 694;
  return {
    width: WIDTH,
    height: HEIGHT,
    canvasFont: {
      name: 'custom',
      fontFamily: 'Helvetica',
      url: 'https://fonts.gstatic.com/s/josefinsans/v20/Qw3PZQNVED7rKGKxtqIqX5E-AVSJrOCfjY46_LjQbMZhKSbpUVzEEQ.woff',
    },
    qrImage: {
      text: tokenId,
      logo: avatar,
      width: 227,
      height: 227,
      logoSize: 120,
      logoWidth: 70,
      logoHeight: 70,
      logoBorderWidth: 8,
      top: 85,
    },
    title: {
      fontSize: '40px',
      fontWeight: '400',
      text: title,
      top: HEIGHT - 20,
      color: '#white',
    },
    hash: {
      text: hash,
    },
    timestamp: {
      color: '#white',
      fontWeight: '100',
      fontSize: '14px',
      text: timestamp,
      top: HEIGHT - 190 + 22,
    },
    ...(config || {}),
  };
};

export const AutIDBadgeGenerator = async ({
  canvas,
  avatar,
  tokenId,
  title,
  timestamp,
  hash,
  config,
  network,
}: SWIDParams): Promise<SWIDOutput> => {
  canvas = canvas || document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  config = defaulConfig(config, avatar, tokenId, title, timestamp, hash);

  canvas.width = config.width;
  canvas.height = config.height;
  const ctxContents = drawCanvasElements(canvas, ctx, config);
  await ctxContents.drawBackground(network);
  // await ctxContents.drawNameAndTime();

  return {
    previewElement: canvas,
    download: (filename = 'AutID.png') => {
      const link = document.createElement('a');
      link.download = filename;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
    },
    toBase64: (mimeType = 'image/png') => canvas.toDataURL(mimeType, 1.0),
    toFile: async (filename = 'AutID.png', mimeType = 'image/png') => {
      return new Promise((resolve) => {
        canvas.toBlob((blob: Blob) => {
          resolve(
            new File([blob], filename, {
              type: mimeType,
            })
          );
        });
      });
    },
  } as SWIDOutput;
};
