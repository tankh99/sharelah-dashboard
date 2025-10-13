export enum StallStatus {
  REJECTED = 'rejected',
  APPROVED = 'approved',
  DRAFT = 'draft'
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  MODERATOR = 'moderator'
}

export enum UserGender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other'
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended'
}

export enum PromoCodeType {
  SIGNUP_DISCOUNT = 'SIGNUP_DISCOUNT',
  RENTAL_PERCENT_OFF = 'RENTAL_PERCENT_OFF',
  ITEM_SPECIFIC_FLAT = 'ITEM_SPECIFIC_FLAT',
}
