const S3_BUCKET_URL = 'https://your-s3-bucket-url.com'; // S3 버킷 URL로 변경해주세요

const getS3ImageUrl = (imagePath: string): string => {
  if (!imagePath) return '';
  
  // 이미 완전한 URL인 경우 그대로 반환
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // S3 버킷 URL과 이미지 경로 조합
  return `${S3_BUCKET_URL}/${imagePath}`;
};

export default getS3ImageUrl; 