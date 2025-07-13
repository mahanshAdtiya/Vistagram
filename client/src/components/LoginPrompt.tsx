const showLoginPrompt = (toast: any, navigate: any) => {
  toast.warning("You need to login to perform this action", {
    action: {
      label: "Login",
      onClick: () => navigate("/login"),
    },
  });
};

export default showLoginPrompt