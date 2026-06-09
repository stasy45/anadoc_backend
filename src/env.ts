export const APP_PORT = 8000;

export const VALIDATION_ERROR = 'Невалидные данные'

export const FORM_VALIDATION = {
  INT: "Поле должно быть числом",
  STRING: "Поле должно быть строкой",
  NOTEMPTY: "Поле должно быть заполнено",
  MAXLENGTH: (value) => `Длина поля не должна превышать ${value} символов`,
}

export const VALIDATION = {
  TOKEN: 'Неверный токен',
  USERNOTFOUND: 'Пользователь не найден',
}

export const COOKIE_SECRET = 'a1b2c3d4e5f67890123456789012345678901234567890123456789012345678'
