const GetThreadDetailUseCase = require("../../../../Applications/use_case/GetThreadDetailUseCase");
const AddThreadUseCase = require("../../../../Applications/use_case/AddThreadUseCase");

class ThreadsHandler {
  constructor(container) {
    this._container = container;
  }

  async postThreadHandler(request, h) {
    const { id: userId } = request.auth.credentials;
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    ///console.log(`postThreadHandler_userId: ${userId}`);
    ///console.log(`postThreadHandler_usecase: ${addThreadUseCase}`);
    ///console.log(`credentpostThreadHandler_payload: ${request.payload}`);
    const addedThread = await addThreadUseCase.execute(userId, request.payload);
    console.log(`addedThread_postThreadHandler: ${addedThread}`);

    const response = h.response({
      status: "success",
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }

  async fetchThreadByIdHandler(request) {
    const { threadId } = request.params;
    const getThreadDetailUseCase = this._container.getInstance(
      GetThreadDetailUseCase.name
    );
    const thread = await getThreadDetailUseCase.execute(threadId);

    return {
      status: "success",
      data: {
        thread,
      },
    };
  }
}

module.exports = ThreadsHandler;
