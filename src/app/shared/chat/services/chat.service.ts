import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from '../../../core/api/api.service';
import { Endpoints } from '../../../core/api/endpoints';

import { ApiResponse } from '../../../features/auth/models/api-response';

import { ChatRequest } from '../models/chat-request';
import { ChatResponse } from '../models/chat-response';
import { ChatHistoryResponse } from '../models/chat-history-response';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private readonly api = inject(ApiService);

  ask(request: ChatRequest): Observable<ApiResponse<ChatResponse>> {
    return this.api.post<ApiResponse<ChatResponse>>(Endpoints.ai.chat, request);
  }

  getHistory(
    beforeMessageId?: string,
    take: number = 10,
  ): Observable<ApiResponse<ChatHistoryResponse>> {
    let endpoint = `${Endpoints.ai.history}?take=${take}`;

    if (beforeMessageId) {
      endpoint += `&beforeMessageId=${beforeMessageId}`;
    }
    return this.api.get<ApiResponse<ChatHistoryResponse>>(endpoint);
  }
}
