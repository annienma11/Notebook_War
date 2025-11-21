using UnityEngine;

namespace NotebookWar.Input
{
    public class KeyboardMouseInput : IInputProvider
    {
        public Vector2 GetMovementInput()
        {
            float x = UnityEngine.Input.GetAxisRaw("Horizontal");
            float z = UnityEngine.Input.GetAxisRaw("Vertical");
            return new Vector2(x, z);
        }

        public Vector2 GetLookInput()
        {
            float mouseX = UnityEngine.Input.GetAxis("Mouse X");
            float mouseY = UnityEngine.Input.GetAxis("Mouse Y");
            return new Vector2(mouseX, mouseY);
        }

        public bool GetJumpInput() => UnityEngine.Input.GetKeyDown(KeyCode.Space);
        public bool GetSprintInput() => UnityEngine.Input.GetKey(KeyCode.LeftShift);
        public bool GetCrouchInput() => UnityEngine.Input.GetKey(KeyCode.LeftControl);
        public bool GetFireInput() => UnityEngine.Input.GetMouseButton(0);
        public bool GetAimInput() => UnityEngine.Input.GetMouseButton(1);
        public bool GetReloadInput() => UnityEngine.Input.GetKeyDown(KeyCode.R);
        public bool GetInteractInput() => UnityEngine.Input.GetKeyDown(KeyCode.E);

        public bool GetWeaponSwitchInput(int weaponNumber)
        {
            if (weaponNumber >= 1 && weaponNumber <= 6)
            {
                return UnityEngine.Input.GetKeyDown(KeyCode.Alpha0 + weaponNumber);
            }
            return false;
        }

        public float GetScrollInput()
        {
            return UnityEngine.Input.GetAxis("Mouse ScrollWheel");
        }
    }
}
