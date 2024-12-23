const DomainErrorTranslator = require("../DomainErrorTranslator");
const InvariantError = require("../InvariantError");

describe("DomainErrorTranslator", () => {
  it("should translate error correctly", () => {
    expect(
      DomainErrorTranslator.translate(
        new Error("REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY")
      )
    ).toStrictEqual(
      new InvariantError(
        "tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada"
      )
    );
    expect(
      DomainErrorTranslator.translate(
        new Error("REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION")
      )
    ).toStrictEqual(
      new InvariantError(
        "tidak dapat membuat user baru karena tipe data tidak sesuai"
      )
    );
    expect(
      DomainErrorTranslator.translate(
        new Error("REGISTER_USER.USERNAME_LIMIT_CHAR")
      )
    ).toStrictEqual(
      new InvariantError(
        "tidak dapat membuat user baru karena karakter username melebihi batas limit"
      )
    );
    expect(
      DomainErrorTranslator.translate(
        new Error("REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER")
      )
    ).toStrictEqual(
      new InvariantError(
        "tidak dapat membuat user baru karena username mengandung karakter terlarang"
      )
    );

    expect(
      DomainErrorTranslator.translate(
        new Error("DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN")
      )
    ).toStrictEqual(new InvariantError("harus mengirimkan token refresh"));
    expect(
      DomainErrorTranslator.translate(
        new Error(
          "DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION"
        )
      )
    ).toStrictEqual(new InvariantError("refresh token harus string"));

    expect(
      DomainErrorTranslator.translate(
        new Error("CREATED_THREAD.MISSING_REQUIRED_FIELDS")
      )
    ).toStrictEqual(
      new InvariantError(
        "tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada"
      )
    );
    expect(
      DomainErrorTranslator.translate(
        new Error("CREATED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION")
      )
    ).toStrictEqual(
      new InvariantError(
        "tidak dapat membuat thread baru karena tipe data tidak sesuai"
      )
    );

    expect(
      DomainErrorTranslator.translate(
        new Error("CREATED_COMMENT.MISSING_REQUIRED_PROPERTY")
      )
    ).toStrictEqual(
      new InvariantError(
        "tidak dapat membuat komentar baru karena properti yang dibutuhkan tidak ada"
      )
    );
    expect(
      DomainErrorTranslator.translate(
        new Error("CREATED_COMMENT.INVALID_DATA_TYPE")
      )
    ).toStrictEqual(new InvariantError("komentar harus berupa string"));

    expect(
      DomainErrorTranslator.translate(
        new Error("CREATED_REPLY.MISSING_REQUIRED_FIELD")
      )
    ).toStrictEqual(
      new InvariantError(
        "tidak dapat membuat balasan baru karena properti yang dibutuhkan tidak ada"
      )
    );
    expect(
      DomainErrorTranslator.translate(
        new Error("CREATED_REPLY.INVALID_DATA_TYPE")
      )
    ).toStrictEqual(new InvariantError("balasan harus berupa string"));
  });

  it("should return original error when error message is not needed to translate", () => {
    // Arrange
    const error = new Error("some_error_message");

    // Action
    const translatedError = DomainErrorTranslator.translate(error);

    // Assert
    expect(translatedError).toStrictEqual(error);
  });
});
