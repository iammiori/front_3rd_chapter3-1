import { act, renderHook } from '@testing-library/react';

import { useSearch } from '../../hooks/useSearch.ts';
import { Event } from '../../types.ts';

describe('useSearch hook 테스트', () => {
  const registeredEvents: Event[] = [
    {
      id: '80d85368-b4a4-47b3-b959-25171d49371f',
      title: '운동',
      date: '2024-11-05',
      startTime: '18:00',
      endTime: '19:00',
      description: '주간 운동',
      location: '헬스장',
      category: '개인',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 30,
    },
    {
      id: '09702fb3-a478-40b3-905e-9ab3c8849dcd',
      title: '항해 정기세션',
      date: '2024-11-02',
      startTime: '13:00',
      endTime: '18:00',
      description: '항플 프론트 세션',
      location: '집',
      category: '성장',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 5,
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
      notificationTime: 10,
    },
  ];

  const currentDate = new Date('2024-11-08');
  const view = 'month' as const;

  it('검색어가 비어있을 때 모든 이벤트를 반환해야 한다', () => {
    const { result } = renderHook(() => useSearch(registeredEvents, currentDate, view));

    expect(result.current.filteredEvents).toEqual(registeredEvents);
  });

  it('검색어에 맞는 이벤트만 필터링해야 한다', () => {
    const { result } = renderHook(() => useSearch(registeredEvents, currentDate, view));

    act(() => {
      result.current.setSearchTerm('운동');
    });

    expect(result.current.filteredEvents).toEqual([
      {
        id: '80d85368-b4a4-47b3-b959-25171d49371f',
        title: '운동',
        date: '2024-11-05',
        startTime: '18:00',
        endTime: '19:00',
        description: '주간 운동',
        location: '헬스장',
        category: '개인',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 30,
      },
    ]);
  });

  it('검색어가 제목, 설명, 위치 중 하나라도 일치하면 해당 이벤트를 반환해야 한다', () => {
    const { result } = renderHook(() => useSearch(registeredEvents, currentDate, view));

    act(() => {
      result.current.setSearchTerm('판교');
    });

    expect(result.current.filteredEvents).toEqual([
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
        notificationTime: 10,
      },
    ]);
  });

  it('현재 뷰(주간/월간)에 해당하는 이벤트만 반환해야 한다', () => {
    const notContainedDate = new Date('2024-11-08');
    const { result } = renderHook(() => useSearch(registeredEvents, notContainedDate, 'week'));

    const {
      current: { filteredEvents },
    } = result;
    expect(filteredEvents).toHaveLength(2);
    expect(filteredEvents).toEqual([
      {
        id: '80d85368-b4a4-47b3-b959-25171d49371f',
        title: '운동',
        date: '2024-11-05',
        startTime: '18:00',
        endTime: '19:00',
        description: '주간 운동',
        location: '헬스장',
        category: '개인',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 30,
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
        notificationTime: 10,
      },
    ]);
  });

  it("검색어를 '회의'에서 '점심'으로 변경하면 필터링된 결과가 즉시 업데이트되어야 한다", () => {
    const events: Event[] = [
      {
        id: '0',
        title: '회의',
        date: '2024-11-07',
        startTime: '09:30',
        endTime: '10:00',
        description: '출근전 내과가기',
        location: '판교',
        category: '개인',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      },
      {
        id: '1',
        title: '점심 산책',
        date: '2024-11-07',
        startTime: '09:30',
        endTime: '10:00',
        description: '출근전 내과가기',
        location: '판교',
        category: '개인',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      },
    ];
    const { result } = renderHook(() => useSearch(events, currentDate, view));

    act(() => {
      result.current.setSearchTerm('회의');
    });

    expect(result.current.filteredEvents).toEqual([
      {
        id: '0',
        title: '회의',
        date: '2024-11-07',
        startTime: '09:30',
        endTime: '10:00',
        description: '출근전 내과가기',
        location: '판교',
        category: '개인',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      },
    ]);

    act(() => {
      result.current.setSearchTerm('점심');
    });

    expect(result.current.filteredEvents).toEqual([
      {
        id: '1',
        title: '점심 산책',
        date: '2024-11-07',
        startTime: '09:30',
        endTime: '10:00',
        description: '출근전 내과가기',
        location: '판교',
        category: '개인',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      },
    ]);
  });
});
