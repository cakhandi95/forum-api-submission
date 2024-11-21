const CreatedThread = require("../../Domains/threads/entities/CreatedThread");

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(userId, useCasePayload) {
    const createdThread = new CreatedThread(useCasePayload);
    ///console.log("add_thread_usescase: ", createdThread);
    return this._threadRepository.createdThread(userId, createdThread);
  }
}

module.exports = AddThreadUseCase;
