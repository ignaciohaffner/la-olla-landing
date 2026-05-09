import { findActiveOffers } from '../repositories/offer.repository';

export const getActiveOffers = () => findActiveOffers(new Date());
