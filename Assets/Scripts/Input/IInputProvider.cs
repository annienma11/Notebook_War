using UnityEngine;

namespace NotebookWar.Input
{
    public interface IInputProvider
    {
        Vector2 GetMovementInput();
        Vector2 GetLookInput();
        bool GetJumpInput();
        bool GetSprintInput();
        bool GetCrouchInput();
        bool GetFireInput();
        bool GetAimInput();
        bool GetReloadInput();
        bool GetInteractInput();
        bool GetWeaponSwitchInput(int weaponNumber);
        float GetScrollInput();
    }
}
