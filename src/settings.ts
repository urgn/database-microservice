type SettingValue = string | number;

interface Settings { [SettingKey: string]: SettingValue }

export const settings: Settings = {
	HTTP_PORT: Number.parseInt(process.env.HTTP_PORT || "3000"),
	DB_URL: process.env.DB_URL || "mongodb://localhost:27017/blog"
};