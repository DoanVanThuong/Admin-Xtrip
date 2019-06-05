import { NgModule } from '@angular/core';
import { AuthRepository, UsersRepository } from './index';
import { TourSuggestRepository } from './tour-suggest.respository';
import { FlightRepo } from './flight.repository';
import { HotelRepo } from './hotel.repository';
import { ProductRepo } from './product.repository';
import { CouponRepo } from './coupon.repository';
import { CouponSuggestRepo } from './coupon-suggest.respository';
import { RewardRepo } from './reward-point.repository';
import { TourRepo } from './tour.repository';
import { GlobalRepo } from './global.repository';
import { PaymentRepo } from './payment.repository';
import { CashierRepo } from './cashier.repository';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  providers: [
    AuthRepository,
    UsersRepository,
    TourSuggestRepository,
    TourRepo,
    FlightRepo,
    HotelRepo,
    ProductRepo,
    CouponRepo,
    CouponSuggestRepo,
    RewardRepo,
    GlobalRepo,
    PaymentRepo,
    CashierRepo,
    HttpClientModule
  ],
})

export class RepositoryModule {

}
