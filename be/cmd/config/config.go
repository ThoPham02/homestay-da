package config

import (
	"fmt"
	"github.com/spf13/viper"
)

type Config struct {
	Http     HttpServer `json:"http" yaml:"http"`
	Database Database   `json:"database" yaml:"database"`
}

type HttpServer struct {
	Path string `json:"path" yaml:"path"`
	Port string `json:"port" yaml:"port"`
}

type Database struct {
	Driver string `json:"driver" yaml:"driver"`
	Source string `json:"source" yaml:"source"`
}

// LoadConfig đọc file config từ đường dẫn được chỉ định
func LoadConfig(configPath string) (*Config, error) {
	viper.SetConfigFile(configPath)
	viper.SetConfigType("yaml")
	
	if err := viper.ReadInConfig(); err != nil {
		return nil, fmt.Errorf("không thể đọc file config: %w", err)
	}
	
	var config Config
	if err := viper.Unmarshal(&config); err != nil {
		return nil, fmt.Errorf("không thể parse config: %w", err)
	}
	
	return &config, nil
}
