const AddThreadUseCase = require("../AddThreadUseCase");
const CreatedThread = require("../../../Domains/threads/entities/CreatedThread");
const AddedThread = require("../../../Domains/threads/entities/AddedThread");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");

describe("AddThreadUseCase", () => {
  it("should orchestrating the add thread action correctly", async () => {
    // Arrange
    const useCasePayload = {
      title: "A thread",
      body: "A long thread",
    };

    const mockAddedThread = new AddedThread({
      id: "thread-123",
      title: "A thread",
      owner: "user-123",
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.createdThread = jest.fn(() =>
      Promise.resolve(mockAddedThread)
    );

    /** creating use case instance */
    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedThread = await addThreadUseCase.execute(
      "user-123",
      useCasePayload
    );

    // Assert
    expect(addedThread).toStrictEqual(
      new AddedThread({
        id: "thread-123",
        title: "A thread",
        owner: "user-123",
      })
    );

    expect(mockThreadRepository.createdThread).toBeCalledWith(
      "user-123",
      new CreatedThread({
        title: useCasePayload.title,
        body: useCasePayload.body,
      })
    );
  });
});
