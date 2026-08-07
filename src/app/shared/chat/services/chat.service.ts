import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from '../../../core/api/api.service';
import { Endpoints } from '../../../core/api/endpoints';

import { ApiResponse } from '../../../features/auth/models/api-response';

import { ChatRequest } from '../models/chat-request';
import { ChatResponse } from '../models/chat-response';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private readonly api = inject(ApiService);

  ask(request: ChatRequest): Observable<ApiResponse<ChatResponse>> {
    return this.api.post<ApiResponse<ChatResponse>>(
      Endpoints.ai.chat,
      request
    );
  }
}