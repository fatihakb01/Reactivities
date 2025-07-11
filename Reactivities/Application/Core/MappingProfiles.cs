using System;
using System.Diagnostics;
using Application.Activities.DTO;
using AutoMapper;
using Domain;

namespace Application.Core;

public class MappingProfiles : Profile
{
    public MappingProfiles()
    {
        CreateMap<Domain.Activity, Domain.Activity>();
        CreateMap<CreateActivityDto, Domain.Activity>();
        CreateMap<EditActivityDto, Domain.Activity>();
    }
}
