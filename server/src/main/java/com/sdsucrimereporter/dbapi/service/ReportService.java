package com.sdsucrimereporter.dbapi.service;

import com.sdsucrimereporter.dbapi.domain.Report;
import com.sdsucrimereporter.dbapi.repo.ReportRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class ReportService {

    private final ReportRepo reportRepo;

    public Report createReport(Report report) {
        return reportRepo.save(report);
    }

    public List<Report> getAllReports() {
        return reportRepo.findAll();
    }

    public List<Report> getReportsByReporter(String reporterId) {
        return reportRepo.findByReporterId(reporterId);
    }

    public Report getReport(String id) {
        return reportRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Report not found"));
    }

    public Report updateReport(String id, Report updatedReport, String reporterId) {
        Report existing = getReport(id);

        // Security check: only the creator can update
        if (!existing.getReporterId().equals(reporterId)) {
            throw new RuntimeException("Unauthorized to update this report");
        }

        // Update fields
        existing.setDate(updatedReport.getDate());
        existing.setTime(updatedReport.getTime());
        existing.setAmpm(updatedReport.getAmpm());
        existing.setYourAge(updatedReport.getYourAge());
        existing.setYourGender(updatedReport.getYourGender());
        existing.setPersonName(updatedReport.getPersonName());
        existing.setPersonAge(updatedReport.getPersonAge());
        existing.setPersonGender(updatedReport.getPersonGender());
        existing.setIncidentType(updatedReport.getIncidentType());
        existing.setDescription(updatedReport.getDescription());
        existing.setCordLat(updatedReport.getCordLat());
        existing.setCordLng(updatedReport.getCordLng());

        return reportRepo.save(existing);
    }

    public void deleteReport(String id, String reporterId) {
        Report report = getReport(id);

        // Security check: only the creator can delete
        if (!report.getReporterId().equals(reporterId)) {
            throw new RuntimeException("Unauthorized to delete this report");
        }

        reportRepo.delete(report);
    }
}