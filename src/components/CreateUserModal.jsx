import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
// import { ScrollArea } from "@/components/ui/scroll-area";
import CreateUserForm from './CreateUserForm';

const CreateUserModal = ({ isOpen, onClose, onSuccess }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-gray-900">
            Create New Member
          </DialogTitle>
        </DialogHeader>
        {/* <ScrollArea className="max-h-[calc(90vh-120px)] px-1"> */}
          <div className="py-4">
            <CreateUserForm
              onClose={onClose}
              onSuccess={(newMember) => {
                onSuccess?.(newMember);
                onClose();
              }}
            />
          </div>
        {/* </ScrollArea> */}
      </DialogContent>
    </Dialog>
  );
};

export default CreateUserModal;