import { Event } from '../../types';
import {
  formatWeek,
  getDaysInMonth,
  getEventsForDay,
  getWeekDates,
  getWeeksAtMonth,
  isLeapYear,
} from '../../utils/dateUtils';

// 윤년 판단을 위해 추가한 테스트 코드
describe('isLeapYear', () => {
  it('2024년은 윤년이다', () => {
    expect(isLeapYear(2024)).toBe(true);
  });

  it('2023년은 윤년이 아니다', () => {
    expect(isLeapYear(2023)).toBe(false);
  });
});

describe('getDaysInMonth', () => {
  it('1월은 31일 수를 반환한다', () => {
    expect(getDaysInMonth(2024, 1)).toBe(31);
  });

  it('4월은 30일 일수를 반환한다', () => {
    expect(getDaysInMonth(2024, 4)).toBe(30);
  });

  it('윤년의 2월에 대해 29일을 반환한다', () => {
    expect(getDaysInMonth(2024, 2)).toBe(29);
  });

  it('평년의 2월에 대해 28일을 반환한다', () => {
    expect(getDaysInMonth(2023, 2)).toBe(28);
  });

  /**
   * 유효하지 않은 월에 대해 적절히 처리한다.
   * -> 적절히 처리한다 가 모호해서, tc 수정
   *
   */
  it('0 이하의 월 지정시, 작년 12월부터 역순으로 한 달씩 감소하며 각 월의 일수를 반환한다', () => {
    expect(getDaysInMonth(2024, 0)).toBe(31);
    expect(getDaysInMonth(2024, -1)).toBe(30);
  });

  it('12 초과의 월 지정시, 다음해 1월부터 순차적으로 한 달씩 증가하며 각 월의 일수를 반환한다', () => {
    expect(getDaysInMonth(2024, 13)).toBe(31);
    expect(getDaysInMonth(2024, 14)).toBe(28);
  });
});

// 질문 : 모든 배열을 비교하기 vs 특정 날짜만 비교 + 배열 length 비교
describe('getWeekDates', () => {
  it('주중의 날짜(수요일)에 대해 올바른 주의 날짜들을 반환한다', () => {
    const wednesday = new Date(2024, 10, 6, 0, 0, 0); // 24/11/6 수요일
    const weekDates = getWeekDates(wednesday);
    expect(weekDates).toEqual([
      new Date(2024, 10, 3), // 일
      new Date(2024, 10, 4), // 월
      new Date(2024, 10, 5), // 화
      new Date(2024, 10, 6), // 수
      new Date(2024, 10, 7), // 목
      new Date(2024, 10, 8), // 금
      new Date(2024, 10, 9), // 토
    ]);
  });

  /**
   * 주의 시작(월요일)에 대해 올바른 주의 날짜들을 반환한다
   * -> fix: 주의 시작은 일요일 이므로 수정 (일 ~ 토)
   *
   */
  it('주의 시작(일요일)에 대해 올바른 주의 날짜들을 반환한다', () => {
    const monday = new Date(2024, 10, 3, 0, 0, 0); // 24/11/4 일요일
    const weekDates = getWeekDates(monday);
    expect(weekDates).toHaveLength(7);
    expect(weekDates[1]).toEqual(new Date(2024, 10, 4));
    expect(weekDates[4]).toEqual(new Date(2024, 10, 7));
  });

  /**
   * 주의 끝(일요일)에 대해 올바른 주의 날짜들을 반환한다
   * -> fix: 주의 끝은 토요일 이므로 수정 (일 ~ 토)
   *
   */
  it('주의 끝(토요일)에 대해 올바른 주의 날짜들을 반환한다', () => {
    const sunDay = new Date(2024, 10, 9, 0, 0, 0); // 24/11/9 토요일
    const weekDates = getWeekDates(sunDay);
    expect(weekDates).toEqual([
      new Date(2024, 10, 3), // 일
      new Date(2024, 10, 4), // 월
      new Date(2024, 10, 5), // 화
      new Date(2024, 10, 6), // 수
      new Date(2024, 10, 7), // 목
      new Date(2024, 10, 8), // 금
      new Date(2024, 10, 9), // 토
    ]);
  });

  it('연도를 넘어가는 주의 날짜를 정확히 처리한다 (연말)', () => {
    const weekDates = getWeekDates(new Date(2024, 11, 29));
    expect(weekDates).toHaveLength(7);
    expect(weekDates[1]).toEqual(new Date(2024, 11, 30));
    expect(weekDates[6]).toEqual(new Date(2025, 0, 4));
  });

  it('연도를 넘어가는 주의 날짜를 정확히 처리한다 (연초)', () => {
    const weekDates = getWeekDates(new Date(2025, 0, 1));
    expect(weekDates).toHaveLength(7);
    expect(weekDates[0]).toEqual(new Date(2024, 11, 29));
    expect(weekDates[6]).toEqual(new Date(2025, 0, 4));
  });

  it('윤년의 2월 29일을 포함한 주를 올바르게 처리한다', () => {
    const weekDates = getWeekDates(new Date(2024, 1, 29));
    expect(weekDates).toHaveLength(7);
    expect(weekDates[0]).toEqual(new Date(2024, 1, 25));
    expect(weekDates[6]).toEqual(new Date(2024, 2, 2));
  });

  it('월의 마지막 날짜를 포함한 주를 올바르게 처리한다', () => {
    const weekDates = getWeekDates(new Date(2024, 9, 31));
    expect(weekDates).toHaveLength(7);
    expect(weekDates[0]).toEqual(new Date(2024, 9, 27));
    expect(weekDates[6]).toEqual(new Date(2024, 10, 2));
  });
});

describe('getWeeksAtMonth', () => {
  /**
   * 2024년 7월 1일의 올바른 주 정보를 반환해야 한다
   * -> fix: 2024년 7월의 모든 날짜를 주차별로 반환해야 한다
   * -> 소신발언: 올바른 주 정보 보다 모든 날짜를 주차별로 가 더 명확한 description이라 생각함
   *
   */
  it('2024년 7월의 모든 날짜를 주차별로 반환해야 한다', () => {
    const julyFirst = new Date(2024, 6, 1);
    const weeks = getWeeksAtMonth(julyFirst);

    // -> fix: 결과 값의 길이를 검증하는  assertion 추가
    expect(weeks.flat().filter((day) => day !== null)).toHaveLength(31);

    const expectedWeeks = [
      [null, 1, 2, 3, 4, 5, 6],
      [7, 8, 9, 10, 11, 12, 13],
      [14, 15, 16, 17, 18, 19, 20],
      [21, 22, 23, 24, 25, 26, 27],
      [28, 29, 30, 31, null, null, null],
    ];

    expect(weeks).toEqual(expectedWeeks);
  });
});

describe('getEventsForDay', () => {
  const mockEvents: Event[] = [
    {
      id: 'da3ca408-836a-4d98-b67a-ca389d07552b',
      title: '프로젝트 마감',
      date: '2024-11-25',
      startTime: '09:00',
      endTime: '18:00',
      description: '분기별 프로젝트 마감',
      location: '사무실',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 1,
    },
    {
      id: 'dac62941-69e5-4ec0-98cc-24c2a79a7f81',
      title: '생일 파티',
      date: '2024-11-28',
      startTime: '19:00',
      endTime: '22:00',
      description: '친구 생일 축하',
      location: '친구 집',
      category: '개인',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 1,
    },
    {
      id: '80d85368-b4a4-47b3-b959-25171d49371f',
      title: '운동',
      date: '2024-11-01',
      startTime: '18:00',
      endTime: '19:00',
      description: '주간 운동',
      location: '헬스장',
      category: '개인',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 1,
    },
  ];
  it('특정 날짜(1일)에 해당하는 이벤트만 정확히 반환한다', () => {
    const foundEvents = getEventsForDay(mockEvents, 1);
    expect(foundEvents).toHaveLength(1);
    expect(foundEvents[0]).toEqual({
      id: '80d85368-b4a4-47b3-b959-25171d49371f',
      title: '운동',
      date: '2024-11-01',
      startTime: '18:00',
      endTime: '19:00',
      description: '주간 운동',
      location: '헬스장',
      category: '개인',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 1,
    });
  });

  it('해당 날짜에 이벤트가 없을 경우 빈 배열을 반환한다', () => {
    const result = getEventsForDay(mockEvents, 6);

    expect(result).toHaveLength(0);
    expect(result).toEqual([]);
  });

  it('날짜가 0일 경우 빈 배열을 반환한다', () => {
    const result = getEventsForDay(mockEvents, 0);

    expect(result).toHaveLength(0);
    expect(result).toEqual([]);
  });

  it('날짜가 32일 이상인 경우 빈 배열을 반환한다', () => {
    const result = getEventsForDay(mockEvents, 32);

    expect(result).toHaveLength(0);
    expect(result).toEqual([]);
  });
});

describe('formatWeek', () => {
  // -> add: 첫째 주의 기준은 매월 1일이 속한 주에 목요일이 포함되는지의 여부에 따라 결정됨.
  it('1일이 속한 주에 목요일이 없는 월은 이전 달의 마지막 주차로 계산된다', () => {
    const date = new Date('2024-11-01');
    expect(formatWeek(date)).toBe('2024년 10월 5주');
  });

  it('1일이 속한 주에 목요일이 없는 월은 해당 월의 1주차로 계산된다', () => {
    const date = new Date('2024-10-01');
    expect(formatWeek(date)).toBe('2024년 10월 1주');
  });

  it('월의 중간 날짜에 대해 올바른 주 정보를 반환한다', () => {
    const date = new Date('2024-11-13');
    expect(formatWeek(date)).toBe('2024년 11월 2주');
  });

  it('월의 첫 주에 대해 올바른 주 정보를 반환한다', () => {
    const date = new Date('2024-11-03');
    expect(formatWeek(date)).toBe('2024년 11월 1주');
  });

  it('월의 마지막 주에 대해 올바른 주 정보를 반환한다', () => {
    const date = new Date('2024-10-31');
    expect(formatWeek(date)).toBe('2024년 10월 5주');
  });

  it('연도가 바뀌는 주에 대해 올바른 주 정보를 반환한다', () => {
    const date = new Date('2024-12-31');
    expect(formatWeek(date)).toBe('2025년 1월 1주');
  });

  it('윤년 2월의 마지막 주에 대해 올바른 주 정보를 반환한다', () => {
    const date = new Date('2024-02-29');
    expect(formatWeek(date)).toBe('2024년 2월 5주');
  });

  it('평년 2월의 마지막 주에 대해 올바른 주 정보를 반환한다', () => {
    const date = new Date('2023-02-28');
    expect(formatWeek(date)).toBe('2023년 3월 1주');
  });
});

describe('formatMonth', () => {
  it("2024년 7월 10일을 '2024년 7월'로 반환한다", () => {});
});

describe('isDateInRange', () => {
  const rangeStart = new Date('2024-07-01');
  const rangeEnd = new Date('2024-07-31');

  it('범위 내의 날짜 2024-07-10에 대해 true를 반환한다', () => {});

  it('범위의 시작일 2024-07-01에 대해 true를 반환한다', () => {});

  it('범위의 종료일 2024-07-31에 대해 true를 반환한다', () => {});

  it('범위 이전의 날짜 2024-06-30에 대해 false를 반환한다', () => {});

  it('범위 이후의 날짜 2024-08-01에 대해 false를 반환한다', () => {});

  it('시작일이 종료일보다 늦은 경우 모든 날짜에 대해 false를 반환한다', () => {});
});

describe('fillZero', () => {
  test("5를 2자리로 변환하면 '05'를 반환한다", () => {});

  test("10을 2자리로 변환하면 '10'을 반환한다", () => {});

  test("3을 3자리로 변환하면 '003'을 반환한다", () => {});

  test("100을 2자리로 변환하면 '100'을 반환한다", () => {});

  test("0을 2자리로 변환하면 '00'을 반환한다", () => {});

  test("1을 5자리로 변환하면 '00001'을 반환한다", () => {});

  test("소수점이 있는 3.14를 5자리로 변환하면 '03.14'를 반환한다", () => {});

  test('size 파라미터를 생략하면 기본값 2를 사용한다', () => {});

  test('value가 지정된 size보다 큰 자릿수를 가지면 원래 값을 그대로 반환한다', () => {});
});

describe('formatDate', () => {
  it('날짜를 YYYY-MM-DD 형식으로 포맷팅한다', () => {});

  it('day 파라미터가 제공되면 해당 일자로 포맷팅한다', () => {});

  it('월이 한 자리 수일 때 앞에 0을 붙여 포맷팅한다', () => {});

  it('일이 한 자리 수일 때 앞에 0을 붙여 포맷팅한다', () => {});
});
