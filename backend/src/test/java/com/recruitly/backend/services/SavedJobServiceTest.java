package com.recruitly.backend.services;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.recruitly.backend.model.Job;
import com.recruitly.backend.repository.JobRepository;
import com.recruitly.backend.repository.UserRepository;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

@ExtendWith(MockitoExtension.class)
public class SavedJobServiceTest {

    @Mock
    UserRepository userRepo;

    @Mock
    JobRepository jobRepo;

    @InjectMocks
    SavedJobService savedJobService;

    @Test
    void unsaveJob_shouldReturnSuccess_whenJobSaved() {
        when(userRepo.unsaveJob(1L, 10L)).thenReturn(true);
        String result = savedJobService.unsaveJob(1L, 10L);
        assertEquals("Successfully unsaved job", result);
    }

    @Test
    void unsaveJob_shouldReturnThrow_whenJobNotSaved() {
        when(userRepo.unsaveJob(1L, 10L)).thenReturn(false);
        assertThrows(ResponseStatusException.class, () ->
            savedJobService.unsaveJob(1L, 10L)
        );
    }

    @Test
    void saveJob_shouldReturnTrue_whenJobSaved() {
        when(jobRepo.findById(any(), any())).thenReturn(Optional.of(new Job()));
        when(userRepo.isSavedJob(1L, 10L)).thenReturn(false);
        when(userRepo.saveJob(1L, 10L)).thenReturn(true);
        String result = savedJobService.saveJob(1L, 10L);
        assertEquals("Successfully saved job", result);
    }

    @Test
    void saveJob_shouldReturnThrow_whenAlreadySaved() {
        when(jobRepo.findById(any(), any())).thenReturn(Optional.of(new Job()));
        when(userRepo.isSavedJob(1L, 10L)).thenReturn(true);
        assertThrows(ResponseStatusException.class, () ->
            savedJobService.saveJob(1L, 10L)
        );
    }

    @Test
    void saveJob_shouldReturnThrow_whenSaveFails() {
        when(jobRepo.findById(any(), any())).thenReturn(Optional.of(new Job()));
        when(userRepo.isSavedJob(1L, 10L)).thenReturn(false);
        when(userRepo.saveJob(1L, 10L)).thenReturn(false);
        assertThrows(ResponseStatusException.class, () ->
            savedJobService.saveJob(1L, 10L)
        );
    }
}
