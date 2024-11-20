const CreatedThread = require("../../Domains/threads/entities/CreatedThread");

class AddedThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(userId, useCasePayload) {
    const createdThread = new CreatedThread(useCasePayload);
    return this._threadRepository.addedThread(userId, createdThread);
  }
}

module.exports = AddedThreadUseCase;
