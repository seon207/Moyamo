import { promises as fs } from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

// ES 모듈에서 __dirname 얻기
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 경로 설정(필요한대로 바꿔서 사용)
const inputDir = path.join(__dirname, '../public/images/logos');
const outputDir = path.join(__dirname, '../public/images/logo');

// const imageWidths = {
//   'dict': 512,
//   'quiz': 440,
//   'puzzle': 128,
// };
const DEFAULT_WIDTH = 320;

// 최적 크기 설정 (픽셀 단위)
// const OPTIMAL_SIZE = 200; // 고해상도 디스플레이 고려하여 2배로 설정

async function optimizeImages() {
  try {
    // 디렉토리가 없으면 생성
    await fs.mkdir(outputDir, { recursive: true }).catch(() => {});

    // 파일 목록 가져오기
    const files = await fs.readdir(inputDir);

    for (const file of files) {
      if (!['.jpg', '.jpeg', '.png', '.webp'].some((ext) => file.toLowerCase().endsWith(ext))) {
        continue; // 이미지 파일이 아니면 건너뛰기
      }

      const inputPath = path.join(inputDir, file);
      const fileName = path.basename(file, path.extname(file));
      const outputPath = path.join(outputDir, `${fileName}.webp`);

      // 원본 이미지 메타데이터 가져오기
      // const metadata = await sharp(inputPath).metadata();

      const width = DEFAULT_WIDTH;

      /* 아래로 정사각형 이미지 변환 사용

      // 이미지 처리
      let sharpInstance = sharp(inputPath);


      // 정사각형 크롭 (원형 아바타용으로 정사각형이 필요함)
      if (metadata.width !== metadata.height) {
        // 정사각형이 아니면 중앙 크롭하여 정사각형으로 만듦
        const size = Math.min(metadata.width, metadata.height);
        sharpInstance = sharpInstance.extract({
          left: Math.floor((metadata.width - size) / 2),
          top: Math.floor((metadata.height - size) / 2),
          width: size,
          height: size,
        });
      }

      // 크기 조정 (원본이 크면 줄이고, 작으면 유지)
      if (metadata.width > OPTIMAL_SIZE || metadata.height > OPTIMAL_SIZE) {
        sharpInstance = sharpInstance.resize({
          width: OPTIMAL_SIZE,
          fit: 'cover', // 원형 아바타용으로 cover가 적합
          withoutEnlargement: true, // 작은 이미지는 확대하지 않음
        });
      }

      // 최적화 및 저장
      await sharpInstance
        .webp({
          quality: 85, // 웹에 적합한 품질
          effort: 6, // 최대 압축 노력
        })
        .toFile(outputPath);

      */

      await sharp(inputPath)
        .resize({
          width: width,
          height: 133,
          fit: 'fill' // 지정한 크기 안에 들어가도록 함
        })
        .webp({ quality: 85 })
        .toFile(outputPath)

        console.log(`최적화 완료: ${fileName}.webp`);
    }

    console.log('모든 이미지 최적화가 완료되었습니다!');
  } catch (error) {
    console.error('이미지 최적화 중 오류 발생:', error);
  }
}

optimizeImages();
