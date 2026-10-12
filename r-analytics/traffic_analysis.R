# ==============================================================================
# MUMBAI TRAFFIC INTELLIGENCE - R ANALYTICS MODULE
# Mumbai Traffic Data Visualization using R & ggplot2 (BDA Semester VII)
# ==============================================================================

# Load Required Libraries
if (!require("ggplot2")) install.packages("ggplot2", repos="http://cran.us.r-project.org")
if (!require("dplyr")) install.packages("dplyr", repos="http://cran.us.r-project.org")
library(ggplot2)
library(dplyr)

# Simulated Mumbai Traffic Records Dataset
traffic_data <- data.frame(
  Hour = rep(6:22, each = 5),
  Road = rep(c("Western Express Highway", "Eastern Express Highway", "LBS Marg", "SV Road", "Sion-Panvel Highway"), 17),
  Speed = c(
    55, 60, 42, 45, 58,  # 06:00 AM
    48, 52, 35, 38, 50,  # 07:00 AM
    32, 38, 22, 25, 35,  # 08:00 AM (Peak)
    25, 30, 18, 20, 28,  # 09:00 AM (Peak)
    28, 34, 20, 22, 30,  # 10:00 AM
    35, 42, 25, 28, 38,  # 11:00 AM
    42, 48, 30, 32, 45,  # 12:00 PM
    45, 50, 32, 35, 48,  # 01:00 PM
    40, 46, 28, 30, 42,  # 02:00 PM
    38, 44, 26, 28, 40,  # 03:00 PM
    32, 38, 22, 24, 34,  # 04:00 PM
    24, 30, 16, 18, 26,  # 05:00 PM (Peak)
    20, 26, 14, 16, 22,  # 06:00 PM (Peak)
    22, 28, 15, 18, 24,  # 07:00 PM
    30, 36, 20, 22, 32,  # 08:00 PM
    40, 46, 28, 30, 42,  # 09:00 PM
    48, 55, 35, 38, 50   # 10:00 PM
  ),
  Volume = c(
    1200, 1100, 950, 900, 1050,
    2400, 2200, 1800, 1750, 2100,
    4200, 3900, 3100, 2900, 3600,
    5800, 5200, 4200, 3800, 4900,
    5100, 4600, 3800, 3500, 4400,
    3800, 3400, 2800, 2600, 3200,
    3100, 2900, 2200, 2100, 2700,
    2900, 2700, 2000, 1900, 2500,
    3200, 2900, 2300, 2200, 2800,
    3600, 3300, 2600, 2500, 3100,
    4600, 4200, 3400, 3200, 4000,
    6200, 5600, 4800, 4500, 5400,
    6900, 6200, 5200, 4900, 6000,
    6400, 5800, 4700, 4400, 5600,
    4800, 4300, 3500, 3300, 4200,
    3100, 2800, 2200, 2100, 2700,
    1900, 1700, 1400, 1300, 1600
  )
)

# Plot 1: Speed vs Volume Density Scatter & Smooth Trend
p1 <- ggplot(traffic_data, aes(x = Volume, y = Speed, color = Road)) +
  geom_point(size = 3, alpha = 0.7) +
  geom_smooth(method = "loess", se = FALSE, size = 1.2) +
  theme_minimal() +
  labs(
    title = "Mumbai Traffic: Speed vs Vehicle Volume Relationship",
    subtitle = "Generated via R + ggplot2 (BDA Semester VII)",
    x = "Vehicle Volume (Vehicles / Hour)",
    y = "Average Speed (km/h)"
  ) +
  theme(
    plot.title = element_text(face = "bold", size = 14),
    panel.grid.minor = element_blank()
  )

# Output Summary
cat("--- MUMBAI TRAFFIC R ANALYTICS SUMMARY ---\n")
print(summary(traffic_data))
