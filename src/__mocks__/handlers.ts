import { http, HttpResponse } from 'msw';

import { Event } from '../types';
import { events } from './response/events.json' assert { type: 'json' };

// ! HARD
// ! 각 응답에 대한 MSW 핸들러를 작성해주세요. GET 요청은 이미 작성되어 있는 events json을 활용해주세요.
export const handlers = [
  http.get('/api/events', () => {
    return HttpResponse.json({ events });
  }),

  http.post('/api/events', async ({ request }) => {
    const response = await request.json();

    const newEvent = { ...(response as Event), id: String(events.length + 1) };

    return HttpResponse.json(newEvent, { status: 201 });
  }),

  http.put('/api/events/:id', async ({ params, request }) => {
    const { id } = params;

    const found = events.find((e) => e.id === id);
    if (!found) {
      return HttpResponse.json({ error: '이벤트 없음' }, { status: 404 });
    }

    const updatedEvent = (await request.json()) as Event;

    return HttpResponse.json({ ...found, ...updatedEvent });
  }),

  http.delete('/api/events/:id', ({ params }) => {
    const { id } = params;

    const found = events.find((e) => e.id === id);
    if (!found) {
      return HttpResponse.json({ error: '이벤트 없음' }, { status: 404 });
    }
    return HttpResponse.json({ message: '삭제 완료!' }, { status: 204 });
  }),
];
