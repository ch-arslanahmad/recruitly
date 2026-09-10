package com.recruitly.backend.services;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;

import com.recruitly.backend.model.Application;
import com.recruitly.backend.model.Job;
import com.recruitly.backend.repository.ApplicationRepository;
import com.recruitly.backend.repository.JobRepository;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

@ExtendWith(MockitoExtension.class)
public class ApplicationServiceTest {

    @Mock
    JobRepository jobRepo;

    @Mock
    ApplicationRepository appRepo;

    @InjectMocks
    ApplicationService appService;

    @Test
    void apply_shouldThrow_whenCreateFails() {
        Application app = new Application();
        app.setJobId(1L);

        Job job = new Job();
        job.setId(1L);

        when(jobRepo.findById(any(), any())).thenReturn(Optional.of(job));

        when(appRepo.find(any())).thenReturn(List.of());

        when(appRepo.create(any(Application.class))).thenReturn(false);
        assertThrows(ResponseStatusException.class, () ->
            appService.apply(1L, app)
        );
    }

    @Test
    void apply_shouldThrow_whenJobNotFound() {
        Application app = new Application();
        app.setJobId(1L);

        when(jobRepo.findById(any(), any())).thenReturn(Optional.empty());

        assertThrows(ResponseStatusException.class, () ->
            appService.apply(1L, app)
        );
    }

    @Test
    void apply_shouldThrow_whenJobClosed() {
        Application app = new Application();
        app.setJobId(1L);

        Job job = new Job();
        job.setId(1L);
        job.setStatus(Job.Status.CLOSED);

        when(jobRepo.findById(any(), any())).thenReturn(Optional.of(job));

        assertThrows(ResponseStatusException.class, () ->
            appService.apply(1L, app)
        );
    }

    @Test
    void apply_shouldThrow_whenAlreadyApplied() {
        Application app = new Application();
        app.setJobId(1L);

        Job job = new Job();
        job.setId(1L);

        when(jobRepo.findById(any(), any())).thenReturn(Optional.of(job));

        when(appRepo.find(any())).thenReturn(List.of(app));

        assertThrows(ResponseStatusException.class, () ->
            appService.apply(1L, app)
        );
    }

    @Test
    void apply_shouldReturnSuccess() {
        Application app = new Application();
        app.setJobId(1L);

        Job job = new Job();
        job.setId(1L);

        when(jobRepo.findById(any(), any())).thenReturn(Optional.of(job));

        when(appRepo.find(any())).thenReturn(List.of());

        when(appRepo.create(any(Application.class))).thenReturn(true);

        assertAll("Applied successfully", () -> appService.apply(1L, app));
    }

    @Test
    void update_shouldReturnSuccess() {
        Application app = new Application();
        app.setId(1L);
        app.setStatus(Application.Status.SHORTLISTED); // update status

        Application currentApp = new Application();
        currentApp.setId(1L);
        currentApp.setStatus(Application.Status.APPLIED); // current status

        // find application
        when(appRepo.find(any())).thenReturn(List.of(currentApp));
        when(appRepo.update(any(), any(), any())).thenReturn(true);
        assertAll("Updated successfully", () -> appService.update(1L, 1L, app));
    }

    @Test
    void update_shouldThrow_whenBodyNull() {
        Application app = null;
        assertThrows(ResponseStatusException.class, () ->
            appService.update(1L, 1L, app)
        );
    }

    @Test
    void update_shouldThrow_whenApplicationNotFound() {
        Application app = new Application();

        when(appRepo.find(any())).thenReturn(List.of());
        assertThrows(ResponseStatusException.class, () ->
            appService.update(1L, 1L, app)
        );
    }

    @Test
    void update_shouldThrow_whenInvalidTransition() {
        Application app = new Application();
        app.setStatus(Application.Status.REJECTED);

        Application currentApp = new Application();
        currentApp.setStatus(Application.Status.APPLIED);

        when(appRepo.find(any())).thenReturn(List.of(currentApp));
        assertThrows(ResponseStatusException.class, () ->
            appService.update(1L, 1L, app)
        );
    }

    @Test
    void update_shouldThrow_whenUpdateFails() {
        Application app = new Application();
        app.setId(1L);
        app.setStatus(Application.Status.APPLIED);

        Application currentApp = new Application();
        currentApp.setId(1L);
        currentApp.setStatus(Application.Status.APPLIED);

        when(appRepo.find(any())).thenReturn(List.of(currentApp));
        when(appRepo.update(any(), any(), any())).thenReturn(false);
        assertThrows(ResponseStatusException.class, () ->
            appService.update(1L, 1L, app)
        );
    }
}
