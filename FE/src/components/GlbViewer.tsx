import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

interface GlbViewerProps {
  url: string;
  index?: number;
}

export function GlbViewer({ url, index = 0 }: GlbViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  useEffect(() => {
    if (!containerRef.current || !url) return;

    if (rendererRef.current) {
      rendererRef.current.dispose();
      containerRef.current.removeChild(rendererRef.current.domElement);
    }

    // Scene 설정
    const scene = new THREE.Scene();

    // Camera 설정
    const camera = new THREE.PerspectiveCamera(
      70,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.y = 1; // 1.5에서 0으로 변경하여 정면에서 보도록 조정
    camera.position.z = 3.0;
    scene.add(camera);

    // Renderer 설정
    rendererRef.current = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    const renderer = rendererRef.current;
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping; // 톤 매핑 추가
    renderer.toneMappingExposure = 1.5; // 노출 증가 (1.0에서 1.5로 변경)
    renderer.setClearColor(0x000000, 0); // 배경색을 투명하게 설정 (두 번째 인자 0은 투명도를 의미)
    containerRef.current.appendChild(renderer.domElement);

    // Light 설정 - 더 밝고 따뜻한 조명으로 변경
    const ambientLight = new THREE.AmbientLight('#fff9e6', 0.8); // 따뜻한 색상, 강도 증가
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight('#ffe0b3', 1.2); // 따뜻한 톤의 주 조명, 강도 증가
    directionalLight.position.x = 1;
    directionalLight.position.z = 1;
    scene.add(directionalLight);

    // 추가 조명으로 부드러운 채우기 조명 추가
    const fillLight = new THREE.DirectionalLight('#ffefcf', 0.8);
    fillLight.position.x = -1;
    fillLight.position.z = 1;
    scene.add(fillLight);

    // 뒷면 조명 추가
    const backLight = new THREE.DirectionalLight('#ffeedd', 0.9);
    backLight.position.z = -2;
    backLight.position.y = 1;
    scene.add(backLight);

    // Controls 설정 - 좌우로만 회전 가능하도록 제한
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // 상하 회전 제한 (좌우만 회전 가능하도록)
    controls.minPolarAngle = Math.PI / 2; // 90도
    controls.maxPolarAngle = Math.PI / 2; // 90도

    // 크기 조절 관련 모든 기능 비활성화
    controls.enableZoom = false; // 마우스 휠 줌 비활성화
    controls.enablePan = false; // 패닝 비활성화
    controls.mouseButtons = {
      LEFT: THREE.MOUSE.ROTATE, // 좌클릭은 회전만 가능
      MIDDLE: null, // 휠클릭 비활성화
      RIGHT: null, // 우클릭 비활성화
    };

    // Animation Mixer
    let mixer: THREE.AnimationMixer | null = null;
    // 두 번째 믹서 추가
    let mixer2: THREE.AnimationMixer | null = null;

    // DRACO 로더 설정
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.5/');
    dracoLoader.setDecoderConfig({ type: 'js' });

    // GLB/GLTF 로더
    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader); // DRACO 로더 설정

    loader.load(
      url,
      (gltf) => {
        // console.log('Model loaded successfully:', gltf);
        const model = gltf.scene;

        // 일반 설정 전에 애니메이션 복제 문제 디버깅
        // console.log('Animation cross-check:');
        gltf.animations.forEach((anim, idx) => {
          if (idx < 3) {
            // 처음 3개만 간단히 확인
            // console.log(`Animation ${idx}: ${anim.name}, duration: ${anim.duration}`);
            // console.log(`  UUID: ${anim.uuid}`);
            // console.log(`  Track count: ${anim.tracks.length}`);
            if (anim.tracks.length > 0) {
              // console.log(`  First track: ${anim.tracks[0].name}`);
              // console.log(`  First track values length: ${anim.tracks[0].values.length}`);
              // console.log(`  First track times length: ${anim.tracks[0].times.length}`);
            }
          }
        });

        // 모델 재질 설정 - 원래 재질이 더 잘 드러나도록 수정
        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            if (child.material) {
              // 금속성과 거칠기를 원본 느낌이 더 살도록 조정
              child.material.roughness = 1.0; // 거칠기 증가 (덜 반짝이게)
              child.material.metalness = 0.1; // 금속성 감소
              child.material.envMapIntensity = 0.6; // 환경 맵 강도 감소
            } else {
              // console.log('One or both armatures missing - falling back to standard animation');

              // 일반적인 방식으로 애니메이션 적용
              if (armature) {
                mixer = new THREE.AnimationMixer(model);
                const animation = gltf.animations[0];
                const action = mixer.clipAction(animation);
                action.timeScale = 0.5;
                action.play();
                // console.log(`Animation "${animation.name}" applied to model for single armature`);
              }
            }
          }

          // 디버깅: 모든 객체와 본 계층 구조 출력
          if (child.name.includes('Armature') || child.type === 'Bone') {
            // console.log(`Found object: "${child.name}" (Type: ${child.type})`);
          }
        });

        scene.add(model);

        // 모델 크기 자동 조정
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const maxSize = Math.max(size.x, size.y, size.z);
        const scale = 2.8 / maxSize;
        model.scale.multiplyScalar(scale);

        // 모델 위치 중앙 정렬
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center.multiplyScalar(scale));

        model.position.y += 0.2; // y 위치를 위로 올리기 (예시로 1만큼 올림)

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

        // console.log(
        //   'Armatures found:',
        //   armature ? 'Armature OK' : 'No Armature',
        //   armature001 ? 'Armature001 OK' : 'No Armature001'
        // );

        // 애니메이션 처리
        if (gltf.animations && gltf.animations.length > 0) {
          // console.log(
          //   'All animations:',
          //   gltf.animations.map((a) => a.name)
          // );

          // 첫 번째 애니메이션 적용 (index = 0)
          if (gltf.animations[0]) {
            mixer = new THREE.AnimationMixer(model);
            const action = mixer.clipAction(gltf.animations[0]);
            action.timeScale = 0.5;
            action.play();
            // console.log(`First animation applied: ${gltf.animations[0].name}`);
          }

          // 두 번째 애니메이션이 있다면 적용 (index = 1)
          if (gltf.animations[1]) {
            mixer2 = new THREE.AnimationMixer(model);
            const action = mixer2.clipAction(gltf.animations[1]);
            action.timeScale = 0.5;
            action.play();
            // console.log(`Second animation applied: ${gltf.animations[1].name}`);
          }

          // 선택된 인덱스의 애니메이션이 아직 적용되지 않았다면 적용
          if (index > 1 && gltf.animations[index] && !mixer && !mixer2) {
            mixer = new THREE.AnimationMixer(model);
            const action = mixer.clipAction(gltf.animations[index]);
            action.timeScale = 0.5;
            action.play();
            // console.log(`Selected animation applied: ${gltf.animations[index].name}`);
          }
        }
      },
      (progress) => {
        const percentage = (progress.loaded / progress.total) * 100;
        // console.log('Loading progress:', percentage + '%');
      },
      (error) => {
        // console.error('\n GLB/GLTF 로딩 에러:', error);
      }
    );

    // 애니메이션 루프
    const clock = new THREE.Clock();

    function draw() {
      const delta = clock.getDelta();

      // 애니메이션 업데이트
      if (mixer) {
        mixer.update(delta);
        // 디버깅 로그: 실제로 애니메이션이 업데이트되고 있는지 확인 (처음 몇 프레임만)
        const frameCount = Math.floor(clock.getElapsedTime() * 60);
        if (frameCount < 10) {
          // console.log(`Animation frame ${frameCount}: Mixer 1 update with delta ${delta}`);
        }
      }

      // 두 번째 애니메이션 업데이트
      if (mixer2) {
        mixer2.update(delta);
        // 디버깅 로그: 실제로 애니메이션이 업데이트되고 있는지 확인 (처음 몇 프레임만)
        const frameCount = Math.floor(clock.getElapsedTime() * 60);
        if (frameCount < 10) {
          // console.log(`Animation frame ${frameCount}: Mixer 2 update with delta ${delta}`);
        }
      }

      controls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(draw);
    }

    // 리사이즈 핸들러
    function handleResize() {
      if (!containerRef.current) return;

      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
      renderer.render(scene, camera);
    }

    window.addEventListener('resize', handleResize);
    draw();

    // 클린업
    return () => {
      window.removeEventListener('resize', handleResize);

      if (mixer) {
        mixer.stopAllAction();
      }

      if (mixer2) {
        mixer2.stopAllAction();
      }

      if (rendererRef.current) {
        rendererRef.current.dispose();

        const canvas = rendererRef.current.domElement;
        if (canvas && canvas.parentNode) {
          canvas.parentNode.removeChild(canvas);
        }

        rendererRef.current = null;
      }
    };
  }, [url, index]);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', background: 'transparent' }} />
  );
}
