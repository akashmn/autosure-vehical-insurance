import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

/**
 * Matches the backend Underwriter entity exactly.
 *
 * Backend field names:
 *   underwriterId  (Long)   – the primary key (auto-generated, starts at 100000)
 *   name           (String)
 *   dob            (LocalDate)  – serialised as "yyyy-MM-dd"
 *   dateOfJoining  (LocalDate)  – serialised as "yyyy-MM-dd"
 *   password       (String)
 *
 * NOTE: The backend entity does NOT have "email" or "role" fields.
 */
export interface Underwriter {
  underwriterId?: number;
  name: string;
  dob: string;
  dateOfJoining: string;
  password?: string;
}

@Injectable({ providedIn: 'root' })
export class UnderwriterService {
  private baseUrl = `${environment.apiUrl}/underwriter`;

  constructor(private http: HttpClient) { }

  /** GET /underwriter/all → returns Underwriter[] directly (no pagination wrapper) */
  getUnderwriters(): Observable<Underwriter[]> {
    return this.http.get<Underwriter[]>(`${this.baseUrl}/all`);
  }

  /** GET /underwriter/search/{id} → returns a single Underwriter */
  getUnderwriter(id: number): Observable<Underwriter> {
    return this.http.get<Underwriter>(`${this.baseUrl}/search/${id}`);
  }

  /** POST /underwriter/register → body: Underwriter → ApiResponse<Underwriter> */
  createUnderwriter(underwriter: Underwriter): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/register`, underwriter);
  }

  /** PUT /underwriter/update/{id} → body: Underwriter → returns updated Underwriter */
  updateUnderwriter(id: number, underwriter: Partial<Underwriter>): Observable<Underwriter> {
    return this.http.put<Underwriter>(`${this.baseUrl}/update/${id}`, underwriter);
  }

  /** DELETE /underwriter/delete/{id} → returns success string */
  deleteUnderwriter(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete/${id}`, { responseType: 'text' });
  }
}
