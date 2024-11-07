import { act, renderHook } from '@testing-library/react';

import { useNotifications } from '../../hooks/useNotifications.ts';
import { Event } from '../../types.ts';
import { formatDate } from '../../utils/dateUtils.ts';
import { parseHM } from '../utils.ts';

it('초기 상태에서는 알림이 없어야 한다', () => {
  const { result } = renderHook(() => useNotifications([]));
  expect(result.current.notifications).toEqual([]);
  expect(result.current.notifiedEvents).toEqual([]);
});

it('지정된 시간이 된 경우 알림이 새롭게 생성되어 추가된다', () => {
  const events: Event[] = [
    {
      id: '0',
      title: '울려라 얍',
      date: formatDate(new Date()),
      startTime: parseHM(Date.now() + 30 * 60 * 1000),
      endTime: parseHM(Date.now() + 40 * 60 * 1000),
      description: '',
      location: '',
      category: '',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 5,
    },
  ];

  const { result } = renderHook(() => useNotifications(events));
  // const { notifications, notifiedEvents } = result.current;

  vi.setSystemTime(new Date(Date.now() + 25 * 60 * 1000));

  act(() => {
    vi.advanceTimersByTime(1000);
  });

  expect(result.current.notifications).toEqual([
    {
      id: '0',
      message: '5분 후 울려라 얍 일정이 시작됩니다.',
    },
  ]);
  expect(result.current.notifiedEvents).toEqual(['0']);
  // expect(notifications).toEqual([
  //   {
  //     id: '0',
  //     message: '5분 후 울려라 얍 일정이 시작됩니다.',
  //   },
  // ]);
  // expect(notifiedEvents).toEqual(['0']);
});

it('index를 기준으로 알림을 적절하게 제거할 수 있다', () => {
  const { result } = renderHook(() => useNotifications([]));

  act(() => {
    result.current.setNotifications([
      { id: '0', message: '첫 번째 알림' },
      { id: '1', message: '두 번째 알림' },
      { id: '2', message: '세 번째 알림' },
    ]);
  });

  expect(result.current.notifications).toHaveLength(3);

  act(() => {
    result.current.removeNotification(1);
  });

  expect(result.current.notifications).toHaveLength(2);
  expect(result.current.notifications).toEqual([
    { id: '0', message: '첫 번째 알림' },
    { id: '2', message: '세 번째 알림' },
  ]);
});

it('이미 알림이 발생한 이벤트에 대해서는 중복 알림이 발생하지 않아야 한다', () => {
  const events: Event[] = [
    {
      id: '0',
      title: '출근',
      date: formatDate(new Date()),
      startTime: parseHM(Date.now() + 30 * 60 * 1000),
      endTime: parseHM(Date.now() + 90 * 60 * 1000),
      description: '',
      location: '',
      category: '',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 5,
    },
  ];

  const { result } = renderHook(() => useNotifications(events));

  vi.setSystemTime(new Date(Date.now() + 25 * 60 * 1000));

  act(() => {
    vi.advanceTimersByTime(1000);
  });

  expect(result.current.notifications).toHaveLength(1);
  expect(result.current.notifiedEvents).toContain('0');

  vi.setSystemTime(new Date(Date.now() + 27 * 60 * 1000));

  act(() => {
    vi.advanceTimersByTime(1000);
  });

  expect(result.current.notifications).toHaveLength(1);
  expect(result.current.notifications).toEqual([
    {
      id: '0',
      message: '5분 후 출근 일정이 시작됩니다.',
    },
  ]);
});
