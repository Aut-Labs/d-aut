import { ContentConfig, SWIDParams, SWIDOutput } from './Badge.model';
import { LoadImage, ScaleImage } from './ImageLoader';
import { AutMumbaiLabel, AutBackgroundSvg, AutAvatarGradient } from './SwBackgroundSvg';
import { generateAutIdDAOSigil } from '../AutSIgilGenerator/SigilGenerator';

const drawCanvasElements = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, config: ContentConfig) => {
  const { name, dao, role, timestamp, hash } = config;

  const drawBackground = async () => {
    let url = null;
    url = AutBackgroundSvg({
      name: name.text,
      hash: hash.text,
      role: role.text,
      dao: dao.text,
      timestamp: timestamp.text,
    });
    const backgroundImage = await LoadImage(url);
    ctx.drawImage(backgroundImage, 35, 0);
  };

  const drawAvatar = async (avatar: string) => {
    const avatarImage = await LoadImage(avatar);
    const maxWidth = 362;
    const maxHeight = 339;
    const { iwScaled, ihScaled } = ScaleImage(maxWidth, maxHeight, avatarImage);

    let offsetX = 0;
    if (iwScaled < maxWidth) {
      offsetX = maxWidth / 2 - iwScaled / 2;
    }
    let offsetY = 0;
    if (ihScaled < maxHeight) {
      offsetY = maxHeight / 2 - ihScaled / 2;
    }
    ctx.drawImage(avatarImage, 107 + offsetX, 112 + offsetY, iwScaled, ihScaled);
  };

  const drawAvatarGradient = async () => {
    let url = null;
    url = AutAvatarGradient();
    const avatarGradient = await LoadImage(url);
    ctx.drawImage(avatarGradient, 95, 112);
  };

  const drawLabel = async () => {
    let url = null;
    url = AutMumbaiLabel();
    const labelImage = await LoadImage(url);
    ctx.drawImage(labelImage, 8, 114);
  };

  const drawSigil = async (expanderAddress: string) => {
    const { toBase64 } = await generateAutIdDAOSigil(expanderAddress);
    const sigilImage = await LoadImage(toBase64());
    const { iwScaled, ihScaled } = ScaleImage(245, 245, sigilImage);
    ctx.drawImage(sigilImage, 250, 460, iwScaled, ihScaled);
  };

  return {
    drawBackground,
    drawLabel,
    drawAvatar,
    drawAvatarGradient,
    drawSigil,
  };
};

const defaulConfig = (
  config: ContentConfig,
  avatar: string,
  name: string,
  dao: string,
  role: string,
  timestamp: string,
  hash: string,
  expanderAddress: string
): ContentConfig => {
  const WIDTH = config?.width || 530;
  const HEIGHT = config?.height || 763;
  return {
    width: WIDTH,
    height: HEIGHT,
    expanderAddress,
    canvasFont: {
      name: 'custom',
      fontFamily: 'Helvetica',
      url: 'https://fonts.gstatic.com/s/josefinsans/v20/Qw3PZQNVED7rKGKxtqIqX5E-AVSJrOCfjY46_LjQbMZhKSbpUVzEEQ.woff',
    },
    name: {
      fontSize: '40px',
      fontWeight: '400',
      text: name,
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
    role: {
      color: '#white',
      fontWeight: '100',
      fontSize: '14px',
      text: role,
      top: HEIGHT - 190 + 22,
    },
    dao: {
      color: '#white',
      fontWeight: '100',
      fontSize: '14px',
      text: dao,
      top: HEIGHT - 190 + 22,
    },
    ...(config || {}),
  };
};

export const AutIDBadgeGenerator = async ({
  canvas,
  avatar,
  tokenId,
  name,
  role,
  dao,
  timestamp,
  hash,
  expanderAddress,
  config,
  network,
}: SWIDParams): Promise<SWIDOutput> => {
  canvas = canvas || document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  config = defaulConfig(config, avatar, name, dao, role, timestamp, hash, expanderAddress);

  canvas.width = config.width;
  canvas.height = config.height;
  const ctxContents = drawCanvasElements(canvas, ctx, config);
  await ctxContents.drawBackground();
  await ctxContents.drawAvatar(avatar);
  await ctxContents.drawAvatarGradient();
  await ctxContents.drawSigil(expanderAddress);
  await ctxContents.drawLabel();

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
