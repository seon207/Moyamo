import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

interface GlbModelLoaderProps {
  url: string;
  scene: THREE.Object3D;
  onLoad?: (model: THREE.Object3D) => void;
  animationIndex?: number;
}

export function GlbModelLoader({ url, scene, onLoad, animationIndex = 0 }: GlbModelLoaderProps) {
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const mixer2Ref = useRef<THREE.AnimationMixer | null>(null);

  useEffect(() => {
    // GLB/GLTF 로더
    const loader = new GLTFLoader();

    // 모델 타입을 THREE.Object3D로 지정 (Group에서 변경)
    let model: THREE.Object3D;

    loader.load(
      url,
      (gltf) => {
        console.log('Model loaded successfully:', gltf);

        // gltf.scene은 THREE.Object3D 타입
        model = gltf.scene;

        // 모델 재질 설정 - 원래 재질이 더 잘 드러나도록 수정
        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            if (child.material) {
              // 금속성과 거칠기를 원본 느낌이 더 살도록 조정
              child.material.roughness = 1.0; // 거칠기 증가 (덜 반짝이게)
              child.material.metalness = 0.1; // 금속성 감소
              child.material.envMapIntensity = 0.6; // 환경 맵 강도 감소
            }
          }

          // 디버깅: 모든 객체와 본 계층 구조 출력
          if (child.name.includes('Armature') || child.type === 'Bone') {
            console.log(`Found object: "${child.name}" (Type: ${child.type})`);
          }
        });

        // Scene에 모델 추가
        scene.add(model);

        // 모델 크기 자동 조정
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const maxSize = Math.max(size.x, size.y, size.z);
        const scale = 2 / maxSize;
        model.scale.multiplyScalar(scale);

        // 모델 위치 중앙 정렬
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center.multiplyScalar(scale));

        // Armature 찾기
        let armature: THREE.Object3D | null = null;
        let armature001: THREE.Object3D | null = null;

        model.traverse((child) => {
          if (child.name === 'Armature') {
            armature = child;
          } else if (child.name === 'Armature001') {
            armature001 = child;
          }
        });

        console.log(
          'Armatures found:',
          armature ? 'Armature OK' : 'No Armature',
          armature001 ? 'Armature001 OK' : 'No Armature001'
        );

        // 애니메이션 처리
        if (gltf.animations && gltf.animations.length > 0) {
          console.log(
            'All animations:',
            gltf.animations.map((a) => a.name)
          );

          // 첫 번째 애니메이션 적용 (index = 0)
          if (gltf.animations[0]) {
            mixerRef.current = new THREE.AnimationMixer(model);
            const action = mixerRef.current.clipAction(gltf.animations[0]);
            action.timeScale = 0.5;
            action.play();
            console.log(`First animation applied: ${gltf.animations[0].name}`);
          }

          // 두 번째 애니메이션이 있다면 적용 (index = 1)
          if (gltf.animations[1]) {
            mixer2Ref.current = new THREE.AnimationMixer(model);
            const action = mixer2Ref.current.clipAction(gltf.animations[1]);
            action.timeScale = 0.5;
            action.play();
            console.log(`Second animation applied: ${gltf.animations[1].name}`);
          }

          // 선택된 인덱스의 애니메이션이 아직 적용되지 않았다면 적용
          if (
            animationIndex > 1 &&
            gltf.animations[animationIndex] &&
            !mixerRef.current &&
            !mixer2Ref.current
          ) {
            mixerRef.current = new THREE.AnimationMixer(model);
            const action = mixerRef.current.clipAction(gltf.animations[animationIndex]);
            action.timeScale = 0.5;
            action.play();
            console.log(`Selected animation applied: ${gltf.animations[animationIndex].name}`);
          }
        }

        // 로드 완료 콜백 실행
        if (onLoad) {
          onLoad(model);
        }
      },
      (progress) => {
        const percentage = (progress.loaded / progress.total) * 100;
        console.log('Loading progress:', percentage + '%');
      },
      (error) => {
        console.error('\n GLB/GLTF 로딩 에러:', error);
      }
    );

    // 클린업
    return () => {
      if (mixerRef.current) {
        mixerRef.current.stopAllAction();
      }
      if (mixer2Ref.current) {
        mixer2Ref.current.stopAllAction();
      }
    };
  }, [url, scene, onLoad, animationIndex]);

  // 애니메이션 업데이트 함수를 반환 - 외부 렌더 루프에서 호출할 수 있게 함
  const updateAnimations = (delta: number) => {
    if (mixerRef.current) {
      mixerRef.current.update(delta);
    }
    if (mixer2Ref.current) {
      mixer2Ref.current.update(delta);
    }
  };

  return { updateAnimations };
}
