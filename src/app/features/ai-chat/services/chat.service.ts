import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from '../../../core/api/api.service';
import { Endpoints } from '../../../core/api/endpoints';
import { ApiResponse } from '../../auth/models/api-response';

import {
  ChatRequest,
  ChatResponse
} from '../models/chat.model';




@Injectable({
  providedIn: 'root'
})
export class AIChatService {
  private api = inject(ApiService);
  chat(request: ChatRequest) {
    return this.api.post<ApiResponse<ChatResponse>>(
      Endpoints.ai.chat,
      request
    );
  }
}