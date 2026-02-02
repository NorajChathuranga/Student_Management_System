package com.eduportal.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceStats {
    private long totalDays;
    private long presentDays;
    private long absentDays;
    private long lateDays;
    private long excusedDays;
    private double attendancePercentage;
}
