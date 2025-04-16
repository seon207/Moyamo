// 개발용 목 데이터 (API 응답 구조에 맞춤)
const standingGlbUrl = '/src/assets/models/Standing.glb';
export const quizMockData = [
  {
    question_id: 1,
    question_text: '[MOCK]이 제스처의 의미는?',
    question_type: 'MEANING',
    gesture_url: standingGlbUrl,
    options: [
      {
        option_id: 1,
        option_meaning: '승리',
        gesture_id: null,
        gesture_image: null,
      },
      {
        option_id: 2,
        option_meaning: '평화',
        gesture_id: null,
        gesture_image: null,
      },
      {
        option_id: 3,
        option_meaning: '모욕',
        gesture_id: null,
        gesture_image: null,
      },
      {
        option_id: 4,
        option_meaning: '인사',
        gesture_id: null,
        gesture_image: null,
      },
    ],
    answer: {
      answer_id: 1,
      answer_option_id: 1,
      correct_gesture_name: null,
    },
  },
  {
    question_id: 6,
    question_text: '[MOCK]미국에서 이 제스처는 돈을 의미합니다. 이 제스처는 무엇일까요?',
    question_type: 'GESTURE',
    gesture_url: null,
    options: [
      {
        option_id: 21,
        option_meaning: null,
        gesture_id: 10,
        gesture_image: standingGlbUrl,
      },
      {
        option_id: 22,
        option_meaning: null,
        gesture_id: 15,
        gesture_image: standingGlbUrl,
      },
      {
        option_id: 23,
        option_meaning: null,
        gesture_id: 16,
        gesture_image: standingGlbUrl,
      },
      {
        option_id: 24,
        option_meaning: null,
        gesture_id: 17,
        gesture_image: standingGlbUrl,
      },
    ],
    answer: {
      answer_id: 6,
      answer_option_id: 21,
      correct_gesture_name: null,
    },
  },
  {
    question_id: 9,
    question_text:
      "[MOCK]미국에서 이 제스처는 '다시 말해주세요'라는 의미를 가집니다. 이 제스처를 카메라에 보여주세요.",
    question_type: 'CAMERA',
    gesture_url: null,
    options: [],
    answer: {
      answer_id: 9,
      answer_option_id: null,
      correct_gesture_name: 'pardon',
    },
  },
  {
    question_id: 1,
    question_text: '[MOCK]이 제스처의 의미는?',
    question_type: 'MEANING',
    gesture_url: standingGlbUrl,
    options: [
      {
        option_id: 1,
        option_meaning: '승리',
        gesture_id: null,
        gesture_image: null,
      },
      {
        option_id: 2,
        option_meaning: '평화',
        gesture_id: null,
        gesture_image: null,
      },
      {
        option_id: 3,
        option_meaning: '모욕',
        gesture_id: null,
        gesture_image: null,
      },
      {
        option_id: 4,
        option_meaning: '인사',
        gesture_id: null,
        gesture_image: null,
      },
    ],
    answer: {
      answer_id: 1,
      answer_option_id: 1,
      correct_gesture_name: null,
    },
  },
  {
    question_id: 6,
    question_text: '[MOCK]미국에서 이 제스처는 돈을 의미합니다. 이 제스처는 무엇일까요?',
    question_type: 'GESTURE',
    gesture_url: null,
    options: [
      {
        option_id: 21,
        option_meaning: null,
        gesture_id: 10,
        gesture_image: standingGlbUrl,
      },
      {
        option_id: 22,
        option_meaning: null,
        gesture_id: 15,
        gesture_image: standingGlbUrl,
      },
      {
        option_id: 23,
        option_meaning: null,
        gesture_id: 16,
        gesture_image: standingGlbUrl,
      },
      {
        option_id: 24,
        option_meaning: null,
        gesture_id: 17,
        gesture_image: standingGlbUrl,
      },
    ],
    answer: {
      answer_id: 6,
      answer_option_id: 21,
      correct_gesture_name: null,
    },
  },
];
