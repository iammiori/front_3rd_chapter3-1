import { Event } from '../../types';
import { getFilteredEvents } from '../../utils/eventUtils';

describe('getFilteredEvents', () => {
  const registeredEvents: Event[] = [
    {
      id: '80d85368-b4a4-47b3-b959-25171d49371f',
      title: '운동',
      date: '2024-07-05',
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
      date: '2024-07-02',
      startTime: '13:00',
      endTime: '18:00',
      description: '항플 프론트 세션',
      location: '집',
      category: '성장',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 1,
    },
    {
      id: 'da3ca408-836a-4d98-b67a-ca389d07552b',
      title: '이벤트 2',
      date: '2024-11-07',
      startTime: '09:30',
      endTime: '10:00',
      description: '출근전 내과가기',
      location: '판교',
      category: '개인',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 0,
    },
  ];
  // 월별이라는 view가 들어가야 더 명확한 테스트 케이스 일거 같아 추가.
  it("월별 뷰에서, 검색어 '이벤트 2'에 맞는 이벤트만 반환한다", () => {
    const result = getFilteredEvents(registeredEvents, '이벤트 2', new Date('2024-11-01'), 'month');
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('이벤트 2');
  });

  it('주간 뷰에서 2024-07-01 주의 이벤트만 반환한다', () => {
    const result = getFilteredEvents(registeredEvents, '', new Date('2024-07-01'), 'week');
    expect(result).toHaveLength(2);
    expect(result.map((e) => e.title)).toEqual(['운동', '항해 정기세션']);
  });

  it('월간 뷰에서 2024년 7월의 모든 이벤트를 반환한다', () => {
    const result = getFilteredEvents(registeredEvents, '', new Date('2024-07-01'), 'month');
    expect(result).toHaveLength(2);
    expect(result.map((e) => e.title)).toEqual(['운동', '항해 정기세션']);
  });

  it("검색어 '이벤트'와 주간 뷰 필터링을 동시에 적용한다", () => {
    const result = getFilteredEvents(registeredEvents, '이벤트', new Date('2024-11-03'), 'week');
    expect(result).toHaveLength(1);
    expect(result.map((e) => e.title)).toEqual(['이벤트 2']);
  });

  // 설명을 좀더 명확하게 표현하기 위해 수정
  it('월간 뷰에서 검색어가 없을 때, 해당 월에 있는 모든 이벤트를 반환한다', () => {
    const result = getFilteredEvents(registeredEvents, '', new Date('2024-07-01'), 'month');
    expect(result).toHaveLength(2);
  });

  it('검색어가 대소문자를 구분하지 않고 작동한다', () => {
    const includeEnglishEvents: Event[] = [
      ...registeredEvents,
      {
        id: '2b7545a6-ebee-426c-b906-2329bc8d62bd',
        title: 'Event 2',
        date: '2024-11-07',
        startTime: '19:30',
        endTime: '20:00',
        description: '퇴근후 내과가기',
        location: '판교',
        category: '개인',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 0,
      },
    ];
    const result = getFilteredEvents(
      includeEnglishEvents,
      'event 2',
      new Date('2024-11-01'),
      'month'
    );
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Event 2');
  });

  it('월의 경계에 있는 이벤트를 올바르게 필터링한다', () => {
    const boundaryEvents: Event[] = [
      {
        id: '0',
        title: '잘가 10월',
        date: '2024-10-30',
        startTime: '23:30',
        endTime: '23:59',
        description: '',
        location: '',
        category: '',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 0,
      },
      {
        id: '1',
        title: '빼빼로 데이',
        date: '2024-11-11',
        startTime: '23:30',
        endTime: '23:59',
        description: '',
        location: '',
        category: '',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 0,
      },
      {
        id: '2',
        title: '우와 12월이다',
        date: '2024-12-01',
        startTime: '00:00',
        endTime: '03:00',
        description: '',
        location: '',
        category: '',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 0,
      },
    ];
    const result = getFilteredEvents(boundaryEvents, '', new Date('2024-11-01'), 'month');
    expect(result).toHaveLength(1);
    expect(result.map((e) => e.title)).toEqual(['빼빼로 데이']);
  });

  it('빈 이벤트 리스트에 대해 빈 배열을 반환한다', () => {
    const result = getFilteredEvents([], '', new Date('2024-11-01'), 'month');
    expect(result).toHaveLength(0);
  });
});
