declare module 'three/examples/jsm/loaders/GLTFLoader' {
  import { Object3D, Scene, Loader } from 'three';

  export interface GLTF {
    scene: Scene;
    scenes: Scene[];
    animations: any[];
    cameras: any[];
    asset: any;
  }

  export class GLTFLoader extends Loader {
    constructor();
    load(
      url: string,
      onLoad: (gltf: GLTF) => void,
      onProgress?: (event: ProgressEvent) => void,
      onError?: (event: ErrorEvent) => void
    ): void;
    parse(
      data: ArrayBuffer,
      path: string,
      onLoad: (gltf: GLTF) => void,
      onError?: (event: ErrorEvent) => void
    ): void;
  }
}

declare module 'three/examples/jsm/controls/OrbitControls' {
  import { Camera, EventDispatcher, Vector3 } from 'three';

  export class OrbitControls extends EventDispatcher {
    constructor(camera: Camera, domElement?: HTMLElement);

    enabled: boolean;
    target: Vector3;

    // 댐핑 관련 속성 추가
    enableDamping: boolean;
    dampingFactor: number;

    update(): boolean;
    dispose(): void;

    // 추가적인 메서드와 속성들...
    minDistance: number;
    maxDistance: number;
    enableZoom: boolean;
    enableRotate: boolean;
    enablePan: boolean;

    // 극좌표각 제어 속성 추가
    minPolarAngle: number;
    maxPolarAngle: number;

    // 마우스 버튼 설정 추가
    mouseButtons: {
      LEFT?: any;
      MIDDLE?: any;
      RIGHT?: any;
    };

    // 카메라 제어 속성
    autoRotate: boolean;
    autoRotateSpeed: number;

    // 회전 속성
    rotateSpeed: number;

    // 줌 속성
    zoomSpeed: number;
    minZoom: number;
    maxZoom: number;

    // 패닝 속성
    panSpeed: number;

    // 키보드 제어
    enableKeys: boolean;
    keys: {
      LEFT: string;
      UP: string;
      RIGHT: string;
      BOTTOM: string;
    };

    // 추가 메서드
    saveState(): void;
    reset(): void;
  }
}
