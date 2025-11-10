package com.cleanwater.config;

import com.cleanwater.model.Report;
import com.cleanwater.model.User;
import com.cleanwater.repository.ReportRepository;
import com.cleanwater.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ReportRepository reportRepository;

    @Override
    public void run(String... args) throws Exception {
        // Check if data already exists
        if (userRepository.count() == 0) {
            // Create demo users
            User citizen = new User();
            citizen.setName("John Citizen");
            citizen.setEmail("john@citizen.com");
            citizen.setPassword("demo123");
            citizen.setRole("citizen");
            citizen.setDepartment("Community Member");
            userRepository.save(citizen);

            User official = new User();
            official.setName("Sarah Official");
            official.setEmail("sarah@waterauthority.gov");
            official.setPassword("demo123");
            official.setRole("official");
            official.setDepartment("Water Quality Authority");
            userRepository.save(official);

            System.out.println("Demo users created successfully!");
        }

        if (reportRepository.count() == 0) {
            // Create demo reports
            Report report1 = new Report();
            report1.setTitle("Drought Conditions Affecting Supply");
            report1.setDetails("Water levels in the main reservoir are critically low, affecting three major districts.");
            report1.setType("Drought");
            report1.setSeverity("High");
            report1.setStatus("Resolved");
            report1.setLocation("Central Valley Reservoir");
            report1.setReporter("Afrid");
            report1.setDateReported("2025-10-28");
            report1.setLastUpdated("2025-10-30");
            report1.setTags("Unsafe Drinking Water,Infrastructure Failure");
            reportRepository.save(report1);

            Report report2 = new Report();
            report2.setTitle("Pipe Burst near High School");
            report2.setDetails("A major water main burst, causing flooding and service interruption.");
            report2.setType("Infrastructure");
            report2.setSeverity("Critical");
            report2.setStatus("In Progress");
            report2.setLocation("123 Main St, Sector 4");
            report2.setReporter("Jane Doe");
            report2.setDateReported("2025-11-01");
            report2.setLastUpdated("2025-11-02");
            report2.setTags("Water Leak,Road Hazard");
            reportRepository.save(report2);

            Report report3 = new Report();
            report3.setTitle("Unusual Smell in Tap Water");
            report3.setDetails("Tap water has a strong, chemical odor in the Western neighborhood.");
            report3.setType("Quality");
            report3.setSeverity("Medium");
            report3.setStatus("Pending Review");
            report3.setLocation("Western Residential Area");
            report3.setReporter("Mark Smith");
            report3.setDateReported("2025-11-03");
            report3.setLastUpdated("2025-11-03");
            report3.setTags("Contamination,Health Risk");
            reportRepository.save(report3);

            System.out.println("Demo reports created successfully!");
        }
    }
}
