using System;
using System.Diagnostics;
using Application.Activities.DTO;
using AutoMapper;
using Domain;

namespace Application.Core;

/// <summary>
/// Configures object-object mappings using AutoMapper.
/// Maps between domain entities and DTOs for activities.
/// </summary>
public class MappingProfiles : Profile
{
    /// <summary>
    /// Initializes mapping configurations for activities.
    /// </summary>
    public MappingProfiles()
    {
        // Allows shallow copy of an Activity object
        CreateMap<Domain.Activity, Domain.Activity>();

        // Map CreateActivityDto to Activity domain model
        CreateMap<CreateActivityDto, Domain.Activity>();

        // Map EditActivityDto to Activity domain model
        CreateMap<EditActivityDto, Domain.Activity>();
    }
}
