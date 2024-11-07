import { Event } from '../../types';
import { createNotificationMessage, getUpcomingEvents } from '../../utils/notificationUtils';

describe('getUpcomingEvents', () => {
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
      notificationTime: 30,
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
  it('알림 시간이 정확히 도래한 이벤트를 반환한다', () => {
    const now = new Date(2024, 10, 7, 9, 20);
    const notifiedEvents: string[] = [];
    const upcomingEvents = getUpcomingEvents(registeredEvents, now, notifiedEvents);
    expect(upcomingEvents).toHaveLength(1);
    expect(upcomingEvents[0].title).toBe('이벤트 2');
  });

  it('이미 알림이 간 이벤트는 제외한다', () => {
    const now = new Date(2024, 10, 7, 9, 20);
    const notifiedEvents: string[] = ['da3ca408-836a-4d98-b67a-ca389d07552b'];
    const upcomingEvents = getUpcomingEvents(registeredEvents, now, notifiedEvents);
    expect(upcomingEvents).toHaveLength(0);
  });

  it('알림 시간이 아직 도래하지 않은 이벤트는 반환하지 않는다', () => {
    const now = new Date(2024, 10, 7, 9, 0);
    const notifiedEvents: string[] = [];
    const upcomingEvents = getUpcomingEvents(registeredEvents, now, notifiedEvents);
    expect(upcomingEvents).toHaveLength(0);
  });

  it('알림 시간이 지난 이벤트는 반환하지 않는다', () => {
    const now = new Date(2024, 10, 7, 9, 30);
    const notifiedEvents: string[] = [];
    const upcomingEvents = getUpcomingEvents(registeredEvents, now, notifiedEvents);
    expect(upcomingEvents).toHaveLength(0);
  });
});

describe('createNotificationMessage', () => {
  it('올바른 알림 메시지를 생성해야 한다', () => {
    const registeredEvent: Event = {
      id: '80d85368-b4a4-47b3-b959-25171d49371f',
      title: '운동',
      date: '2024-07-05',
      startTime: '18:00',
      endTime: '19:00',
      description: '주간 운동',
      location: '헬스장',
      category: '개인',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 30,
    };
    const message = createNotificationMessage(registeredEvent);
    expect(message).toBe('30분 후 운동 일정이 시작됩니다.');
  });
});
