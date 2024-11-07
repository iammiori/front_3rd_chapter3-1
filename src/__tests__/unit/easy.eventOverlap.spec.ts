import { Event } from '../../types';
import {
  convertEventToDateRange,
  findOverlappingEvents,
  isOverlapping,
  parseDateTime,
} from '../../utils/eventOverlap';

describe('parseDateTime', () => {
  it('2024-07-01 14:30을 정확한 Date 객체로 변환한다', () => {
    const parsedData = parseDateTime('2024-07-01', '14:30');
    expect(parsedData).toEqual(new Date('2024-07-01T14:30:00'));
  });

  it('잘못된 날짜 형식에 대해 Invalid Date를 반환한다', () => {
    const parsedData = parseDateTime('2024-13-23', '09:41');
    expect(parsedData.toString()).toBe('Invalid Date');
  });

  it('잘못된 시간 형식에 대해 Invalid Date를 반환한다', () => {
    const parsedData = parseDateTime('2024-11-06', '25:00');
    expect(parsedData.toString()).toBe('Invalid Date');
  });

  it('날짜 문자열이 비어있을 때 Invalid Date를 반환한다', () => {
    const parsedData = parseDateTime('', '14:30');
    expect(parsedData.toString()).toBe('Invalid Date');
  });
});

describe('convertEventToDateRange', () => {
  it('일반적인 이벤트를 올바른 시작 및 종료 시간을 가진 객체로 변환한다', () => {
    const validEvent: Event = {
      id: '80d85368-b4a4-47b3-b959-25171d49371f',
      title: '운동',
      date: '2024-11-22',
      startTime: '18:00',
      endTime: '19:00',
      description: '주간 운동',
      location: '헬스장',
      category: '개인',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 1,
    };

    const parsedData = convertEventToDateRange(validEvent);

    expect(parsedData.start).toEqual(new Date(2024, 10, 22, 18, 0));
    expect(parsedData.end).toEqual(new Date(2024, 10, 22, 19, 0));
  });

  it('잘못된 날짜 형식의 이벤트에 대해 Invalid Date를 반환한다', () => {
    const invalidDateEvent: Event = {
      id: '80d85368-b4a4-47b3-b959-25171d49371f',
      title: '운동',
      date: '2024-13-31',
      startTime: '18:00',
      endTime: '19:00',
      description: '주간 운동',
      location: '헬스장',
      category: '개인',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 1,
    };

    const { start, end } = convertEventToDateRange(invalidDateEvent);

    expect(start.toString()).toBe('Invalid Date');
    expect(end.toString()).toBe('Invalid Date');
  });

  it('잘못된 시간 형식의 이벤트에 대해 Invalid Date를 반환한다', () => {
    const invalidTimeEvent: Event = {
      id: '80d85368-b4a4-47b3-b959-25171d49371f',
      title: '운동',
      date: '2024-12-25',
      startTime: '33:00',
      endTime: '35:00',
      description: '주간 운동',
      location: '헬스장',
      category: '개인',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 1,
    };

    const { start, end } = convertEventToDateRange(invalidTimeEvent);

    expect(start.toString()).toBe('Invalid Date');
    expect(end.toString()).toBe('Invalid Date');
  });
});

describe('isOverlapping', () => {
  it('두 이벤트가 겹치는 경우 true를 반환한다', () => {
    const event1: Event = {
      id: '80d85368-b4a4-47b3-b959-25171d49371f',
      title: '운동',
      date: '2024-11-22',
      startTime: '18:00',
      endTime: '19:00',
      description: '주간 운동',
      location: '헬스장',
      category: '개인',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 1,
    };
    const event2: Event = {
      id: '09702fb3-a478-40b3-905e-9ab3c8849dcd',
      title: '치맥',
      date: '2024-11-22',
      startTime: '18:00',
      endTime: '19:00',
      description: '저녁약속',
      location: '판교역',
      category: '개인',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 1,
    };
    expect(isOverlapping(event1, event2)).toBe(true);
  });

  it('두 이벤트가 겹치지 않는 경우 false를 반환한다', () => {
    const event1: Event = {
      id: '80d85368-b4a4-47b3-b959-25171d49371f',
      title: '운동',
      date: '2024-11-22',
      startTime: '18:00',
      endTime: '19:00',
      description: '주간 운동',
      location: '헬스장',
      category: '개인',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 1,
    };
    const event2: Event = {
      id: '09702fb3-a478-40b3-905e-9ab3c8849dcd',
      title: '항해 정기세션',
      date: '2024-11-09',
      startTime: '13:00',
      endTime: '18:00',
      description: '항플 프론트 세션',
      location: '집',
      category: '성장',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 1,
    };
    expect(isOverlapping(event1, event2)).toBe(false);
  });
});

describe('findOverlappingEvents', () => {
  const registeredEvents: Event[] = [
    {
      id: '80d85368-b4a4-47b3-b959-25171d49371f',
      title: '운동',
      date: '2024-11-22',
      startTime: '18:00',
      endTime: '19:00',
      description: '주간 운동',
      location: '헬스장',
      category: '개인',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 1,
    },
    {
      id: '09702fb3-a478-40b3-905e-9ab3c8849dcd',
      title: '항해 정기세션',
      date: '2024-11-09',
      startTime: '13:00',
      endTime: '18:00',
      description: '항플 프론트 세션',
      location: '집',
      category: '성장',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 1,
    },
  ];
  it('새 이벤트와 겹치는 모든 이벤트를 반환한다', () => {
    const newEvent: Event = {
      id: 'dac62941-69e5-4ec0-98cc-24c2a79a7f81',
      title: '생일 파티',
      date: '2024-11-22',
      startTime: '18:00',
      endTime: '19:00',
      description: '친구 생일 축하',
      location: '친구 집',
      category: '개인',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 1,
    };
    const result = findOverlappingEvents(newEvent, registeredEvents);
    expect(result).toHaveLength(1);
    expect(result).toContain(registeredEvents[0]);
  });

  it('겹치는 이벤트가 없으면 빈 배열을 반환한다', () => {
    const newEvent: Event = {
      id: 'da3ca408-836a-4d98-b67a-ca389d07552b',
      date: '2024-11-07',
      startTime: '09:30',
      endTime: '10:00',
      title: '병원',
      description: '출근전 내과가기',
      location: '판교',
      category: '개인',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 0,
    };
    const result = findOverlappingEvents(newEvent, registeredEvents);
    expect(result).toHaveLength(0);
  });
});
