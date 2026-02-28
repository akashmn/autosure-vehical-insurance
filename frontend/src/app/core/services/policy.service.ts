import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';

/**
 * Matches the backend Insurance entity exactly.
 *
 * Backend field names:
 *   policyNo       (Long)      – the primary key
 *   vehicleNo      (String)
 *   vehicleType    (String)    – "2-wheeler" or "4-wheeler"
 *   customerName   (String)
 *   engineNo       (String)
 *   chassisNo      (String)
 *   phoneNo        (String)
 *   type           (String)    – "Full Insurance" or "Third Party"
 *   premiumAmount  (Double)
 *   vehicleValue   (double)
 *   ncb            (double)
 *   claimStatus    (boolean)
 *   fromDate       (LocalDate) – "yyyy-MM-dd"
 *   toDate         (LocalDate) – "yyyy-MM-dd"
 *   underWriterId  (Long)      – note the capital W
 */
export interface Policy {
  policyNo?: number;
  customerName: string;
  vehicleNo: string;
  vehicleType: string;
  engineNo: string;
  chassisNo: string;
  phoneNo?: string;
  type: string;
  premiumAmount: number;
  vehicleValue?: number;
  ncb?: number;
  claimStatus?: boolean;
  fromDate: string;
  toDate: string;
  underWriterId: number;
}

/** Backend generic wrapper */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

@Injectable({ providedIn: 'root' })
export class PolicyService {
  private baseUrl = `${environment.apiUrl}/insurance`;

  constructor(private http: HttpClient) { }

  /**
   * GET /insurance/all
   * Response: ApiResponse<Policy[]>  →  we unwrap and return the data array
   */
  getPolicies(): Observable<Policy[]> {
    return this.http
      .get<ApiResponse<Policy[]>>(`${this.baseUrl}/all`)
      .pipe(map(res => res.data));
  }

  /**
   * GET /insurance/{policyNo}
   * Response: ApiResponse<Policy>  →  we unwrap and return the data object
   */
  getPolicy(policyNo: number): Observable<Policy | null> {
    return this.http
      .get<ApiResponse<Policy>>(`${this.baseUrl}/${policyNo}`)
      .pipe(map(res => res.success ? res.data : null));
  }

  /**
   * GET /insurance/underwriter/{underwriterId}
   * Response: Policy[]  (direct list, no wrapper when 200, or 204 No Content)
   */
  getPoliciesByUnderwriter(underwriterId: number): Observable<Policy[]> {
    return this.http.get<Policy[]>(`${this.baseUrl}/underwriter/${underwriterId}`);
  }

  /**
   * POST /insurance/create
   * Body: Insurance object
   * Response: ApiResponse<Policy>
   */
  createPolicy(policy: Policy): Observable<ApiResponse<Policy>> {
    return this.http.post<ApiResponse<Policy>>(`${this.baseUrl}/create`, policy);
  }

  /**
   * DELETE /insurance/delete/{policyNo}
   * Response: ApiResponse<string>
   */
  deletePolicy(policyNo: number): Observable<ApiResponse<string>> {
    return this.http.delete<ApiResponse<string>>(`${this.baseUrl}/delete/${policyNo}`);
  }

  /** PUT /insurance/renew/{policyNo} → returns updated Insurance */
  renewPolicy(policyNo: number): Observable<Policy> {
    return this.http.put<Policy>(`${this.baseUrl}/renew/${policyNo}`, {});
  }

  /** PUT /insurance/changePolicy/{policyNo} → returns string message */
  changePolicy(policyNo: number): Observable<string> {
    return this.http.put(`${this.baseUrl}/changePolicy/${policyNo}`, {}, { responseType: 'text' });
  }
}
