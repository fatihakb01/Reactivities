using System;
using System.Diagnostics;
using Application.Activities.DTO;
using Application.Profiles.DTOs;
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

        // Map Activity domain model to ActivityDto
        CreateMap<Domain.Activity, ActivityDto>()
            .ForMember(d => d.HostDisplayName, o => o.MapFrom(s =>
                s.Attendees.FirstOrDefault(x => x.IsHost)!.User.DisplayName))
            .ForMember(d => d.HostId, o => o.MapFrom(s =>
                s.Attendees.FirstOrDefault(x => x.IsHost)!.User.Id));

        // Map ActivityAttendee to UserProfile
        CreateMap<ActivityAttendee, UserProfile>()
            .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.User.DisplayName))
            .ForMember(d => d.Bio, o => o.MapFrom(s => s.User.Bio))
            .ForMember(d => d.ImageUrl, o => o.MapFrom(s => s.User.ImageUrl))
            .ForMember(d => d.Id, o => o.MapFrom(s => s.User.Id));

        // Map User Domain model to UserProfile
        CreateMap<User, UserProfile>();
    }
}
