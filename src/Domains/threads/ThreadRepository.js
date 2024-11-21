/* eslint-disable no-unused-vars */
class ThreadRepository {
  async createThread(userId, createdThread) {
    throw new Error("THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async fetchThreadById(id) {
    throw new Error("THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async verifyThreadExists(threadId) {
    throw new Error(
      "THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED_VERIFY_THREAD_EXISTS"
    );
  }
}

module.exports = ThreadRepository;
