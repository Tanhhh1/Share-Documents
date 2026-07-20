using API_ShareDocuments.Controllers.Common;
using Application.Common;
using Application.CQRS.Account.Commands.CreateAccount;
using Application.CQRS.Account.Commands.LockAccount;
using Application.CQRS.Account.Commands.UnlockAccount;
using Application.CQRS.Account.Commands.UpdateAccount;
using Application.CQRS.Account.DTOs;
using Application.CQRS.Account.Queries.GetAllAccount;
using Application.CQRS.Account.Queries.GetByAccountId;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API_ShareDocuments.Controllers.V1.Admin
{
    [Authorize(Roles = "Admin")]
    public class AccountController : AdminApiController
    {
        private readonly IMediator _mediator;

        public AccountController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        [ProducesResponseType(typeof(ApiResult<PageList<AccountDto>>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResult<PageList<AccountDto>>), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetAll([FromQuery] GetAllAccountQuery query)
        {
            var result = await _mediator.Send(query);
            if (!result.Succeeded)
                return BadRequest(result);
            return Ok(result);
        }

        [HttpGet("{id}")]
        [ProducesResponseType(typeof(ApiResult<AccountDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResult<AccountDto>), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _mediator.Send(new GetByAccountIdQuery { Id = id});
            if (!result.Succeeded)
                return NotFound(result);
            return Ok(result);
        }

        [HttpPost]
        [ProducesResponseType(typeof(ApiResult<AccountDto>), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(ApiResult<AccountDto>), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Create([FromBody] CreateAccountCommand command)
        {
            var result = await _mediator.Send(command);
            if (!result.Succeeded)
                return BadRequest(result);
            return CreatedAtAction(nameof(GetById), new { id = result.Result!.Id }, result);
        }

        [HttpPut("{id}")]
        [ProducesResponseType(typeof(ApiResult<AccountDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResult<AccountDto>), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateAccountCommand command)
        {
            if (id != command.Id)
                return BadRequest(ApiResult<AccountDto>.Failure("Mã tài khoản không khớp"));

            var result = await _mediator.Send(command);
            if (!result.Succeeded)
                return BadRequest(result);
            return Ok(result);
        }

        [HttpPatch("lock/{id}")]
        [ProducesResponseType(typeof(ApiResult<bool>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResult<bool>), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Lock(int id)
        {
            var result = await _mediator.Send(new LockAccountCommand { Id = id });
            if (!result.Succeeded)
                return BadRequest(result);
            return Ok(result);
        }

        [HttpPatch("unlock/{id}")]
        [ProducesResponseType(typeof(ApiResult<bool>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResult<bool>), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Unlock(int id)
        {
            var result = await _mediator.Send(new UnlockAccountCommand { Id = id });
            if (!result.Succeeded)
                return BadRequest(result);
            return Ok(result);
        }
    }
}