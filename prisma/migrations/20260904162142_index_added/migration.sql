-- CreateIndex
CREATE INDEX "Like_targetUserId_idx" ON "Like"("targetUserId");

-- CreateIndex
CREATE INDEX "Member_gender_dateOfBirth_idx" ON "Member"("gender", "dateOfBirth");

-- CreateIndex
CREATE INDEX "Member_updated_idx" ON "Member"("updated");

-- CreateIndex
CREATE INDEX "Member_created_idx" ON "Member"("created");

-- CreateIndex
CREATE INDEX "Message_senderId_createdAt_idx" ON "Message"("senderId", "createdAt");

-- CreateIndex
CREATE INDEX "Message_recipientId_createdAt_idx" ON "Message"("recipientId", "createdAt");

-- CreateIndex
CREATE INDEX "Message_recipientId_dateRead_idx" ON "Message"("recipientId", "dateRead");

-- CreateIndex
CREATE INDEX "Photo_memberId_idx" ON "Photo"("memberId");
