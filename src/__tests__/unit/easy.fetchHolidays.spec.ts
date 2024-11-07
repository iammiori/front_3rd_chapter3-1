import { fetchHolidays } from '../../apis/fetchHolidays';

describe('fetchHolidays', () => {
  it('주어진 월의 공휴일만 반환한다', () => {
    const date = new Date('2024-10-01');
    const holidays = fetchHolidays(date);
    expect(Object.keys(holidays)).toHaveLength(2);
    expect(holidays['2024-10-03']).toBe('개천절');
  });

  it('공휴일이 없는 월에 대해 빈 객체를 반환한다', () => {
    const date = new Date('2024-11-01');
    const holidays = fetchHolidays(date);
    expect(Object.keys(holidays)).toHaveLength(0);
  });

  it('여러 공휴일이 있는 월에 대해 모든 공휴일을 반환한다', () => {
    const date = new Date('2024-02-01');
    const holidays = fetchHolidays(date);
    expect(Object.keys(holidays)).toHaveLength(3);
    expect(holidays).toEqual({
      '2024-02-09': '설날',
      '2024-02-10': '설날',
      '2024-02-11': '설날',
    });
  });
});
